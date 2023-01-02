# Preenchimento boleto

O preenchimento do boleto deve ser feito de acordo com o método abaixo

::: warning Aviso!
Número de identificação do boleto (correspondente ao **NOSSO NÚMERO**), no formato **STRING**,
com 20 dígitos, que deverá ser formatado da seguinte forma: “000” + (**número do convênio** com 7 dígitos) + (**número de controle** com 10 dígitos - se necessário, completar com zeros à esquerda).
:::

```java
private BoletoModel preencheBoleto() {
    BoletoModel boleto = new BoletoModel();
    boleto.setBeneficiario(new Beneficiario());
    boleto.getBeneficiario().setNumeroConvenio("3128557");
    boleto.getBeneficiario().setCarteira("17");
    boleto.getBeneficiario().setVariacaoCarteira("35");
    boleto.setCodigoModalidade(1);
    boleto.setDataVencimento(LocalDate.now().plusMonths(1));
    boleto.setValorBoleto(BigDecimal.TEN);
    boleto.setAceite(true);
    boleto.setEspecieDocumento("2");
    boleto.setAutorizaPagamentoParcial(true);

    // Código para testar com número random
    Random random = new Random();
    int low = 39999;
    int high = 9999999;
    int numeroBoleto = random.nextInt(high-low) + low;

    boleto.setNumeroBoleto(String.valueOf(numeroBoleto));
    boleto.setNumeroDaParcelaCarne(1);

    // Número de identificação do boleto (correspondente ao NOSSO NÚMERO), no formato STRING,
    // com 20 dígitos, que deverá ser formatado da seguinte forma: “000” + (número do convênio com 7 dígitos)
    // + (número de controle com 10 dígitos - se necessário, completar com zeros à esquerda).
    String nossoNumero = "000" // 3 digitos fixo
                + StringUtils.leftPad(boleto.getBeneficiario().getNumeroConvenio(), 7, "0") // convenio 7 digitos
                + StringUtils.leftPad(boleto.getNumeroBoleto() + boleto.getNumeroDaParcelaCarne(), 10, "0"); // numeroBoleto + parcela 10 ditigos
    boleto.setNossoNumero(nossoNumero);

    Pagador pagador = new Pagador();
    pagador.setTipoInscricao(1);
    pagador.setNumeroInscricao(97965940132L);
    pagador.setNome("Odorico Paraguassu");

    Endereco endereco = new Endereco();
    endereco.setLogradouro("Avenida Dias Gomes 1970");
    endereco.setCep("77458000");
    endereco.setCidade("Sucupira");
    endereco.setBairro("Centro");
    endereco.setUf("TO");

    pagador.setEndereco(endereco);
    boleto.setPagador(pagador);

    return boleto;
}
```