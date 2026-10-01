resource "kubernetes_manifest" "selfsigned" {
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "ClusterIssuer"

    metadata = {
      name = "league-selfsigned"
    }

    spec = {
      selfSigned = {}
    }
  }
}


resource "kubernetes_manifest" "root_ca" {
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "Certificate"

    metadata = {
      name      = "league-root-ca"
      namespace = "cert-manager"
    }

    spec = {
      isCA       = true
      commonName = "League Platform Local Root CA"
      secretName = "league-root-ca"

      duration    = "8760h"
      renewBefore = "720h"

      privateKey = {
        algorithm      = "ECDSA"
        size           = 256
        rotationPolicy = "Never"
      }

      usages = [
        "cert sign",
        "crl sign",
        "digital signature"

      ]

      issuerRef = {
        name  = "league-selfsigned"
        kind  = "ClusterIssuer"
        group = "cert-manager.io"
      }
    }
  }
  depends_on = [kubernetes_manifest.selfsigned]
}


resource "kubernetes_manifest" "local_ca" {
  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "ClusterIssuer"

    metadata = {
      name = "league-local-ca"
    }

    spec = {
      ca = {
        secretName = "league-root-ca"
      }
    }
  }
  depends_on = [kubernetes_manifest.root_ca]
}
