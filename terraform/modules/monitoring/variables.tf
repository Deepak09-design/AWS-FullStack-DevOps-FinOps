variable "project_name" { type = string }
variable "environment" { type = string }
variable "ec2_instance_id" { type = string }
variable "create_cpu_alarm" { type = bool }
variable "budget_limit_usd" {
  type     = number
  default  = null
  nullable = true
}
variable "budget_email" { type = string }
variable "tags" { type = map(string) }
