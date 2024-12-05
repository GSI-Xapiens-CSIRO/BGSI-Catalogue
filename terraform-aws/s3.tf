# bucket definition
resource "aws_s3_bucket" "bgsi-catalogue-hosted-bucket" {
  bucket_prefix = "bgsi-catalogue-bucket-"
  force_destroy = true
  tags          = var.common-tags
}

# allow cloudfront to access s3
resource "aws_s3_bucket_policy" "s3_access_from_cloudfront" {
  bucket = aws_s3_bucket.bgsi-catalogue-hosted-bucket.id
  policy = data.aws_iam_policy_document.s3_access_from_cloudfront.json
}

# iam policy
data "aws_iam_policy_document" "s3_access_from_cloudfront" {
  statement {
    principals {
      type = "Service"
      identifiers = [
        "cloudfront.amazonaws.com"
      ]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.bgsi-catalogue-hosted-bucket.arn}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values = [
        aws_cloudfront_distribution.bgsi-catalogue-s3-distribution.arn
      ]
    }
  }
}
