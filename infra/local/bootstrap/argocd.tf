resource "helm_release" "argocd" {
  name             = "agrocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  version          = "10.9.6"
  namespace        = "argocd"
  create_namespace = true

  atomic          = true
  cleanup_on_fail = true
  wait            = true
  wait_for_jobs   = true
  timeout         = 900

  values = [file("${path.module}/argocd-values.yaml")]

  depends_on = [helm_release.traefik, helm_release.cert_manager]
}
