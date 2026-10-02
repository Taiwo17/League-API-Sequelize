variable "name" {
  description = "Prefix used to name network resources."
  type        = string
}

variable "vpc_cidr" {
  description = "IPv4 /16 network, divided into /24 subnets."

  type = string

  validation {
    condition     = try(cidrnetmask(var.vpc_cidr) == "255.255.0.0", false)
    error_message = "vpc_cidr must be a valid IPv4 /16 CIDR."
  }
}

variable "availability_zones" {
  description = "Two distinct availability zones, in stable order."
  type        = list(string)

  validation {
    condition     = (length(var.availability_zones) == 2 && length(distinct(var.availability_zones)) == 2)
    error_message = "Provide exactly two distinct availability zones."
  }
}


variable "tags" {
  description = "Tags applied to every network resources"
  type        = map(string)
  default     = {}
}
