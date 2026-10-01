data "kubernetes_namespace_v1" "dev" {
  metadata {
    name = "dev"
  }
}


output "verified_namespace" {
  description = "Existing namespace read from the k3d cluster."
  value       = data.kubernetes_namespace_v1.dev.metadata[0].name
}
