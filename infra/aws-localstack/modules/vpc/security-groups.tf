variable "service_ports" {
  description = "Application, database, and outbound SMTP ports."

  type = object({
    application = number
    database    = number
    smtp        = number
  })

  default = {
    application = 4500
    database    = 3306
    smtp        = 587
  }

  validation {
    condition = alltrue([
      for port in values(var.service_ports) :
      port >= 1 && port <= 65535 && port == floor(port)
    ])
    error_message = "Each service port must be an integer from 1 to 65535."
  }
}

resource "aws_security_group" "tier" {
  for_each = toset(["web", "app", "database"])

  name_prefix = "${var.name}-${each.key}-"
  description = "Traffic controls for the ${each.key} tier"
  vpc_id      = aws_vpc.this.id

  tags = merge(var.tags, {
    Name = "${var.name}-${each.key}"
    Tier = each.key
  })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_vpc_security_group_ingress_rule" "web_https" {
  security_group_id = aws_security_group.tier["web"].id
  description       = "Public HTTPS entry point"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
}

resource "aws_vpc_security_group_ingress_rule" "app_from_web" {
  security_group_id            = aws_security_group.tier["app"].id
  referenced_security_group_id = aws_security_group.tier["web"].id
  description                  = "Application requests from the web tier"
  ip_protocol                  = "tcp"
  from_port                    = var.service_ports.application
  to_port                      = var.service_ports.application
}


resource "aws_vpc_security_group_ingress_rule" "database_from_app" {
  security_group_id            = aws_security_group.tier["database"].id
  referenced_security_group_id = aws_security_group.tier["app"].id
  description                  = "Database connections from the application tier"
  ip_protocol                  = "tcp"
  from_port                    = var.service_ports.database
  to_port                      = var.service_ports.database
}

resource "aws_vpc_security_group_egress_rule" "web_to_app" {
  security_group_id            = aws_security_group.tier["web"].id
  referenced_security_group_id = aws_security_group.tier["app"].id
  description                  = "Forward requests to the application tier"
  ip_protocol                  = "tcp"
  from_port                    = var.service_ports.application
  to_port                      = var.service_ports.application
}

resource "aws_vpc_security_group_egress_rule" "app_to_database" {
  security_group_id            = aws_security_group.tier["app"].id
  referenced_security_group_id = aws_security_group.tier["database"].id
  description                  = "Connect to the database tier"
  ip_protocol                  = "tcp"
  from_port                    = var.service_ports.database
  to_port                      = var.service_ports.database
}

resource "aws_vpc_security_group_egress_rule" "app_external" {
  for_each = {
    https = 443
    smtp  = var.service_ports.smtp
  }

  security_group_id = aws_security_group.tier["app"].id
  description       = "Outbound ${each.key} connections"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = each.value
  to_port           = each.value
}
