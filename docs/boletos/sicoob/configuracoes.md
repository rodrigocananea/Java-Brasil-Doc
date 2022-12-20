# Configurações Sicoob

### Inicialização API

```java
ConfiguracaoSicoobAPI configuracao = new ConfiguracaoSicoobAPI();
configuracao.setClientId("mgS6gZLbT93COP2LgKFaSHF7sMQa");
configuracao.setCpfCnpj("38052160005701");
configuracao.setContaCorrente("700033690");
configuracao.setCooperativa("0001");
configuracao.setNumeroContrato(123);
configuracao.setBasicToken("bWdTNmdaTGJUOTNDT1AyTGdLRmFTSEY3c01RYTpzc3Y2bl9OeWpBYndPUWJhMWJNeldaVVk1bFlh");
configuracao.setAmbiente(AmbienteEnum.HOMOLOGACAO);
configuracao.setExpiracaoToken(LocalDateTime.now().plusDays(1));
configuracao.setToken("a14b36f0-fb10-35c8-8462-7e545ceb34eb");
configuracao.setRefreshToken("42bdfb56-6bf5-348f-8c9d-fe3eb592ad4a");

boletoService = new BoletoService(BoletoBanco.SICOOB_API, configuracao);
```
### Inicialização CNAB 240

```java
ConfiguracaoSicoobCnab240 configuracao = new ConfiguracaoSicoobCnab240();
boletoService = new BoletoService(BoletoBanco.SICOOB_CNAB240, configuracao);
```
