# Deploying the BGSi Catalogue

## Prerequisites
Ensure you have the following installed:
- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- [pnpm](https://pnpm.io/installation)

## Deployment Steps

### 1. Create Terraform Configuration Files
Create the necessary Terraform configuration files:
- `backend.tf`
- `terraform.tfvars`

Refer to the provided example files:
- `backend.tf.example`
- `terraform.tfvars.example`

Modify the values in these files as needed. Ensure that the correct API URL is provided for each Hub.

### 2. Install Frontend Dependencies
From the repository root, navigate to the `webapp` directory and install dependencies:
```sh
cd webapp
pnpm install
```

### 3. Initialise and Apply Terraform Configuration
From the repository root, navigate to the `terraform-aws` directory and run the following commands:
```sh
cd terraform-aws
terraform init
terraform plan
terraform apply
```
This will set up the required AWS infrastructure for the BGSi Catalogue.

## Notes
- Ensure your AWS credentials are configured properly before running Terraform.
- Review the Terraform plan before applying changes to confirm expected modifications.

Once these steps are completed, the BGSi Catalogue should be deployed successfully.
