# Configurações Exemplo

Aqui será apresentado as configurações básicas que deve ter conhecimento para uso da biblioteca.

### Uso de API/CNAB
Para uso de qualquer boleto por API ou CNAB deve ser instanciado a configuração (referente ao banco de uso) inicial a ser utilizada, mesmo que não precise passar nenhum parâmetro para ela.

```java
ConfiguracaoExemplo configuracao = new ConfiguracaoExemplo();
configuracao.setUsuario("teste");
configuracao.setSenha("123");

BoletoService boletoService = new BoletoService(BoletoBanco.EXEMPLO, configuracao);
```
