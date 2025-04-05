# Configurar Localização

Use esta configuração para corrigir a localização do arquivo de impressão, assim evitamos problemas com o jasper obtendo a localização do computador e garantindo que a moeda apresentada será em reais.

```java
JRPropertiesUtil.getInstance(DefaultJasperReportsContext.getInstance()).setProperty("net.sf.jasperreports.default.locale", "pt_BR");
```
