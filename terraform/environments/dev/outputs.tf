output "vpc_id" {
  description = "CloudCart VPC ID."
  value       = module.network.vpc_id
}

output "public_subnet_ids" {
  description = "Public subnet IDs."
  value       = module.network.public_subnet_ids
}

output "private_subnet_ids" {
  description = "Private subnet IDs."
  value       = module.network.private_subnet_ids
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS name."
  value       = module.compute.alb_dns_name
}

output "ec2_instance_id" {
  description = "EC2 instance ID for the FastAPI host."
  value       = module.compute.ec2_instance_id
}

output "cloudfront_url" {
  description = "CloudFront URL for the frontend and /api/* path."
  value       = module.storage.cloudfront_url
}

output "frontend_bucket_name" {
  description = "Private S3 bucket for frontend build files."
  value       = module.storage.frontend_bucket_name
}

output "rds_endpoint" {
  description = "RDS MySQL endpoint (hostname and port)."
  value       = module.database.rds_endpoint
}

output "database_secret_arn" {
  description = "Secrets Manager ARN containing the RDS username and generated password."
  value       = module.database.database_secret_arn
}
