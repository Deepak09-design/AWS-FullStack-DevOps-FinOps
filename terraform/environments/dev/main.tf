locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

module "network" {
  source = "../../modules/network"

  project_name         = var.project_name
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  availability_zones   = slice(data.aws_availability_zones.available.names, 0, 2)
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  tags                 = local.common_tags
}

module "compute" {
  source = "../../modules/compute"

  project_name      = var.project_name
  environment       = var.environment
  vpc_id            = module.network.vpc_id
  public_subnet_ids = module.network.public_subnet_ids
  instance_type     = var.ec2_instance_type
  tags              = local.common_tags
}

module "database" {
  source = "../../modules/database"

  project_name        = var.project_name
  environment         = var.environment
  private_subnet_ids  = module.network.private_subnet_ids
  vpc_id              = module.network.vpc_id
  application_sg_id   = module.compute.application_security_group_id
  db_name             = var.db_name
  db_username         = var.db_username
  db_instance_class   = var.db_instance_class
  allocated_storage   = var.db_allocated_storage
  deletion_protection = var.enable_deletion_protection
  tags                = local.common_tags
}

module "storage" {
  source = "../../modules/storage"

  project_name = var.project_name
  environment  = var.environment
  alb_dns_name = module.compute.alb_dns_name
  tags         = local.common_tags
}

module "monitoring" {
  source = "../../modules/monitoring"

  project_name     = var.project_name
  environment      = var.environment
  ec2_instance_id  = module.compute.ec2_instance_id
  create_cpu_alarm = var.enable_cloudwatch_alarm
  budget_limit_usd = var.budget_limit_usd
  budget_email     = var.budget_email
  tags             = local.common_tags
}
