# Configurações Banrisul

### Inicialização API

```java
ConfiguracaoBanrisulAPI configuracao = new ConfiguracaoBanrisulAPI();
configuracao.setAmbiente(AmbienteEnum.HOMOLOGACAO);
configuracao.setCaminhoCertificado("D:/Temp/dacar.jks");
configuracao.setSenhaCertificado("12345678");
configuracao.setUrlBaseProducao("solicitar ao banco");
configuracao.setUrlBaseHomologacao("https://ww20.banrisul.com.br/boc/link/Bocswsxn_CobrancaOnlineWS.asmx");
boletoService = new BoletoService(BoletoBanco.BANRISUL_API, configuracao);
```
### Inicialização CNAB 240

```java
ConfiguracaoBanrisulCnab240 configuracao = new ConfiguracaoBanrisulCnab240();
boletoService = new BoletoService(BoletoBanco.BANRISUL_CNAB240, configuracao);
```
