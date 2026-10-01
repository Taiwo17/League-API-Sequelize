locals {
  kubeconfig_path = pathexpand("~/.kube/config")
  kube_context    = "k3d-league-platform"
}


provider "kubernetes" {
  config_path    = local.kubeconfig_path
  config_context = local.kube_context
}


provider "helm" {
  kubernetes = {
    config_path    = local.kubeconfig_path
    config_context = local.kube_context
  }
}
