# Configurações Exemplo

Aqui será apresentado as configurações básicas que deve ter conhecimento para uso da biblioteca.

## Uso de API/CNAB
Para uso de qualquer boleto por API ou CNAB deve ser instanciado a configuração (referente ao banco de uso) inicial a ser utilizada, mesmo que não precise passar nenhum parâmetro para ela.

```java
ConfiguracaoExemplo configuracao = new ConfiguracaoExemplo();
configuracao.setUsuario("teste");
configuracao.setSenha("123");

BoletoService boletoService = new BoletoService(BoletoBanco.EXEMPLO, configuracao);
```

## Métodos Adicionais


### Imprimir
```java
BoletoModel boletoModel = preencheBoleto();

// Retorno em JasperPrint
byte[] boletoImprimir = boletoService.imprimirBoleto(boletoModel);

// Retorno em byte array
byte[] boletoImprimir = boletoService.imprimirBoletoByte(boletoModel);

// Ou
// Imprimir com jasper 
boolean imprimirDireto = false;
PrintService impressoraUtilizada = // impressora padrão ou selecionada

// Caso o imprimirDireto seja false será aberto na 
// tela um jasperViewer com o PDF dentro
boletoService.imprimirBoletoJasperDesktop(boletoModel, imprimirDireto, impressoraPadrao);
```

### Imprimir em conjunto
Cada metodo para impressão (fora as API) contem um construtor para receber um `List<BoletoModel>`
```java
BoletoModel boleto1 = preencheBoleto();
BoletoModel boleto2 = preencheBoleto();

byte[] bytesUnidos = boletoService.imprimirBoletoByte(Arrays.asList(boleto1, boleto2));

Files.write(Paths.get("d:/teste/teste.pdf"), bytesUnidos);
```
