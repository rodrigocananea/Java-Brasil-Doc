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

### Inicialização CNAB 400

```java
ConfiguracaoItauCnab400 configuracao = new ConfiguracaoItauCnab400();
boletoService = new BoletoService(BoletoBanco.ITAU_CNAB400, configuracao);
```
