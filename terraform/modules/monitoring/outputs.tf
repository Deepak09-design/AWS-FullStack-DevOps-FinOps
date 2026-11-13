output "cpu_alarm_name" {
  value = try(aws_cloudwatch_metric_alarm.ec2_cpu_high[0].alarm_name, null)
}
output "monthly_budget_name" {
  value = try(aws_budgets_budget.monthly[0].name, null)
}
