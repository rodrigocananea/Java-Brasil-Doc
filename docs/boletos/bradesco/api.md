# API

::: tip Sobre
O método [preencheBoleto](/boletos/banrisul/preenchimento) deve ser utilizado conforme 
na pagina lida anteriormente junto a inicialização do [boletoService](/boletos/banrisul/configuracoes)
:::

### Envio
```java
BoletoModel boletoModel = preencheBoleto();
BoletoModel retorno = boletoService.enviarBoleto(boletoModel);
System.out.println(retorno.getCodRetorno() + " - " + retorno.getMensagemRetorno());
System.out.println(retorno.getCodigoBarras());
```
### Imprimir
::: warning INFO
Ainda está sendo implementado este método.
:::

### Alterar / Consultar / Baixa
::: danger Aviso
O banco não permite essas operações via API
:::