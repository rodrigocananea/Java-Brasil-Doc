# Configurações Banrisul

### Inicialização API

```java
ConfiguracaoItauAPI configuracao = new ConfiguracaoItauAPI();
configuracao.setClientId("");
configuracao.setClientSecret("");
configuracao.setAmbiente(AmbienteEnum.HOMOLOGACAO);
configuracao.setCaminhoCertificado("");
configuracao.setSenhaCertificado("");
boletoService = new BoletoService(BoletoBanco.ITAU_API, configuracao);
```
