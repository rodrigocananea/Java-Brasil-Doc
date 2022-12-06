# Configurações Banrisul

### Inicialização API

```java
ConfiguracaoBradescoAPI configuracao = new ConfiguracaoBradescoAPI();
configuracao.setClientId("9c228ae2-6277-4a8c-a26b-51223a0aaa09");
configuracao.setCpfCnpj("38052160005701");
configuracao.setAmbiente(AmbienteEnum.HOMOLOGACAO);
configuracao.setCaminhoCertificado("d:/teste/bradesco.pem");
boletoService = new BoletoService(BoletoBanco.BRADESCO_API, configuracao);
```
### Inicialização CNAB 400

```java
ConfiguracaoBradescoCnab400 configuracao = new ConfiguracaoBradescoCnab400();
boletoService = new BoletoService(BoletoBanco.BRADESCO_CNAB400, configuracao);
```
