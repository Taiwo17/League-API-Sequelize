terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0, < 7.0"
    }
  }
}

locals {
  tier_offsets = {
    public  = 0
    private = 16
    data    = 32
  }

  subnets = merge([
    for tier, offset in local.tier_offsets : {
      for index, zone in var.availability_zones :
      "${tier}-${zone}" => {
        tier = tier
        zone = zone
        cidr = cidrsubnet(var.vpc_cidr, 8, offset + index)
      }
    }
  ]...)
}


resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(var.tags, {
    Name = var.name
  })
}

resource "aws_subnet" "this" {
  for_each = local.subnets

  vpc_id                  = aws_vpc.this.id
  cidr_block              = each.value.cidr
  availability_zone       = each.value.zone
  map_public_ip_on_launch = false

  tags = merge(var.tags, {
    Name = " ${var.name}-${each.key}"
    Tier = each.value.tier
  })
}
