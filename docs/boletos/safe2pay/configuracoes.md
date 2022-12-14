# Configurações Banrisul

### Inicialização API

```java
ConfiguracaoSafe2PayAPI configuracao = new ConfiguracaoSafe2PayAPI();
configuracao.setSandbox(false);
configuracao.setToken(FileUtils.readFileToString(new File("/safe2pay/token.txt")));
boletoService = new BoletoService(BoletoBanco.SAFE2PAY_API, configuracao);
```
