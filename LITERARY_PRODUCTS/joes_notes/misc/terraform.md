# TERRAFORM

[**Terraform**](terraform.md) is an open-source [**infrastructure as code (IaC)**](broken-reference) tool developed by [**HashiCorp**](../HASHICORP.md). It enables users to define and provision data center infrastructure using a high-level configuration language known as [**HashiCorp Configuration Language (HCL)**](../HCL.md). Terraform allows for the automation of infrastructure management, making it easier to create, change, and improve infrastructure safely and efficiently.

## Key Features

* **Infrastructure as Code (IaC)**: Terraform allows users to manage infrastructure through code, enabling version control and collaboration similar to software development practices.
* **Provider Agnostic**: Terraform supports multiple [**cloud providers**](global_stocktake.md) (AWS, Azure, Google Cloud, etc.) and services, allowing for a unified approach to managing resources across different platforms.
* **Execution Plans**: Before making any changes, Terraform generates an execution plan that shows what actions will be taken. This helps prevent unexpected changes and ensures that users are aware of the modifications being made.
* [**Resource Graph**](resource_graph.md): Terraform builds a dependency graph of all resources in the configuration, which allows it to parallelize the creation and destruction of resources where possible, improving efficiency.
* **State Management**: Terraform maintains a state file that tracks the current state of the infrastructure. This state file is essential for understanding the existing infrastructure and making incremental changes.

## Use Cases

* **Cloud Infrastructure Provisioning**: Organizations can use Terraform to provision cloud resources like virtual machines, storage accounts, and networking components in a consistent manner.
* **Multi-Cloud Deployments**: Terraform facilitates the management of resources across multiple cloud environments, simplifying operations for organizations adopting multi-cloud strategies.
* **Automated Infrastructure Management**: With Terraform, teams can automate the lifecycle of their infrastructure, enabling faster deployments and reducing manual errors.

## Case Study: California Department of Health Care Services (DHCS)

The [**California Department of Health Care Services (DHCS)**](hashicorp_dhcs.md) adopted Terraform Cloud as part of its modernization efforts to streamline its legacy healthcare technology. Key outcomes from this implementation include:

* **Standardization**: DHCS was able to standardize its infrastructure management processes using Terraform, reducing the time required to provision new environments from weeks to hours.
* **Increased Efficiency**: The automation capabilities of Terraform enabled DHCS's platform engineering team to implement stable and scalable infrastructure that helps applications reach production up to 70% faster.
* **Improved Visibility and Control**: With Terraform, DHCS gained greater visibility into its infrastructure, allowing for quicker troubleshooting and more responsive change management.
* **Foundation for Future Growth**: The implementation of Terraform has laid the groundwork for DHCS to support up to 200 applications in the future by consolidating diverse legacy technology tools into a single platform.
