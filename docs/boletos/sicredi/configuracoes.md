# Configurações Sicredi

### Inicialização CNAB 400

```java
ConfiguracaoSicrediCnab400 configuracao = new ConfiguracaoSicrediCnab400();
boletoService = new BoletoService(BoletoBanco.SICREDI_CNAB400, configuracao);
```
