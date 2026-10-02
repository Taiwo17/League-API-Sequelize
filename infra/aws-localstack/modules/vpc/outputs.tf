output "security_group_ids" {

  description = "Security group IDs by tier."

  value = {
    for tier, group in aws_security_group.tier :
    tier => group.id
  }
}

output "vpc_id" {
  description = "ID of the VPC."
  value       = aws_vpc.this.id
}

output "subnet_ids_by_tier" {
  description = "Subnet IDs grouped by tier and availability zone."

  value = {
    for tier in keys(local.tier_offsets) : tier => {
      for key, subnet in aws_subnet.this : local.subnets[key].zone => subnet.id
      if local.subnets[key].tier == tier
    }
  }
}

output "nat_gateway_ids" {
  description = "NAT gateway IDs by availability zone."

  value = {
    for zone, gateway in aws_nat_gateway.this :
    zone => gateway.id
  }
}

output "route_table_ids" {
  description = "Route table ID groups by tier"

  value = {
    public = aws_route_table.public.id
    private = {
      for zone, table in aws_route_table.private :
      zone => table.id
    }
    data = aws_route_table.data.id
  }
}


