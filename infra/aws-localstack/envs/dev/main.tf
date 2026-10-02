module "vpc" {
  source = "../../modules/vpc"

  name               = "league-platform-dev"
  vpc_cidr           = "10.42.0.0/16"
  availability_zones = ["us-east-1a", "us-east-1b"]


  tags = {
    Project     = "league-platform"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }

  service_ports = {
    application = 4500
    database    = 3306
    smtp        = 465
  }
}

output "vpc_id" {
  value = module.vpc.vpc_id

}

output "subnet_ids_by_tier" {
  value = module.vpc.subnet_ids_by_tier
}

output "security_group_ids" {
  value = module.vpc.security_group_ids
}
