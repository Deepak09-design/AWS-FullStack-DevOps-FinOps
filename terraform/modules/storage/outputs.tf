output "cloudfront_url" {
  value = "https://${aws_cloudfront_distribution.main.domain_name}"
}
output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}
