# Configurações Banrisul

### Inicialização API

```java
ConfiguracaoBancoBrasilAPI configuracao = new ConfiguracaoBancoBrasilAPI();
configuracao.setClientId("");
configuracao.setClientSecret("");
configuracao.setDeveloperKey("");
configuracao.setAuthorization("Copiar Basic Auth");
configuracao.setAmbiente(AmbienteEnum.HOMOLOGACAO);
boletoService = new BoletoService(BoletoBanco.BANCO_BRASIL_API, configuracao);
```
### Inicialização CNAB 240

```java
ConfiguracaoBancoBrasilCnab240 configuracao = new ConfiguracaoBancoBrasilCnab240();
boletoService = new BoletoService(BoletoBanco.BANCO_BRASIL_API, configuracao);
```
