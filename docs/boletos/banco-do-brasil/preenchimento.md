# Preenchimento boleto

O preenchimento do boleto deve ser feito de acordo com o método abaixo

::: warning Aviso!
Número de identificação do boleto (correspondente ao **NOSSO NÚMERO**), no formato **STRING**,
com 20 dígitos, que deverá ser formatado da seguinte forma: “000” + (**número do convênio** com 7 dígitos) + (**número de controle** com 10 dígitos - se necessário, completar com zeros à esquerda).
:::

### API

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

    boleto.setNumeroDocumento(String.valueOf(numeroBoleto));
    boleto.setNumeroDaParcelaCarne(1);

    // Número de identificação do boleto (correspondente ao NOSSO NÚMERO), no formato STRING,
    // com 20 dígitos, que deverá ser formatado da seguinte forma: “000” + (número do convênio com 7 dígitos)
    // + (número de controle com 10 dígitos - se necessário, completar com zeros à esquerda).
    String nossoNumero = "000" // 3 digitos fixo
                + StringUtils.leftPad(boleto.getBeneficiario().getNumeroConvenio(), 7, "0") // convenio 7 digitos
                + StringUtils.leftPad(boleto.getNumeroDocumento() + boleto.getNumeroDaParcelaCarne(), 10, "0"); // numeroDocumento + parcela 10 ditigos
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

### CNAB / Impressão

```java
private BoletoModel preencheBoleto() {
    BoletoModel boleto = new BoletoModel();

    Beneficiario beneficiario = new Beneficiario();
    beneficiario.setAgencia("452");
    beneficiario.setCarteira("17");
    beneficiario.setVariacaoCarteira("35");
    beneficiario.setConta("123873");
    beneficiario.setDocumento("74910037000193");
    beneficiario.setNomeBeneficiario("TECIDOS FARIA DUARTE");
    beneficiario.setDigitoAgencia("0");
    beneficiario.setDigitoConta("77");
    beneficiario.setNumeroConvenio("3128557");
    beneficiario.setCarteira("21");

    Endereco enderecoBenef = new Endereco();
    enderecoBenef.setBairro("CENTRO");
    enderecoBenef.setCep("96030400");
    enderecoBenef.setCidade("PELOTAS");
    enderecoBenef.setComplemento("");
    enderecoBenef.setLogradouro("RUA OLAVO BILAC");
    enderecoBenef.setNumero("722");
    enderecoBenef.setUf("RS");
    beneficiario.setEndereco(enderecoBenef);
    boleto.setBeneficiario(beneficiario);

    boleto.setCodigoModalidade(1);
    boleto.setDataEmissao(LocalDate.now());
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

    boleto.setNumeroDocumento(String.valueOf(numeroBoleto));
    boleto.setNumeroDaParcelaCarne(1);

    // Número de identificação do boleto (correspondente ao NOSSO NÚMERO), no formato STRING,
    // com 20 dígitos, que deverá ser formatado da seguinte forma: “000” + (número do convênio com 7 dígitos)
    // + (número de controle com 10 dígitos - se necessário, completar com zeros à esquerda).
    String nossoNumero = "000" // 3 digitos fixo
                + StringUtils.leftPad(boleto.getBeneficiario().getNumeroConvenio(), 7, "0") // convenio 7 digitos
                + StringUtils.leftPad(boleto.getNumeroDocumento() + boleto.getNumeroDaParcelaCarne(), 10, "0"); // numeroBoleto + parcela 10 ditigos
    boleto.setNossoNumero(nossoNumero);

    Pagador pagador = new Pagador();
    pagador.setDocumento("97965940132");
    pagador.setNome("Odorico Paraguassu");

    Endereco endereco = new Endereco();
    endereco.setLogradouro("Avenida Dias Gomes 1970");
    endereco.setCep("77458000");
    endereco.setCidade("Sucupira");
    endereco.setBairro("Centro");
    endereco.setUf("TO");

    pagador.setEndereco(endereco);
    boleto.setPagador(pagador);

    boleto.setContratoEspecie("805076");
    boleto.setNossoNumero("22200593");
    boleto.setDigitoNossoNumero("78");

    java.util.List<InformacaoModel> locaisPagamento = new ArrayList<>();
    locaisPagamento.add(new InformacaoModel("PAGÁVEL PREFERENCIALMENTE EM CANAIS DA SUA INSTITUIÇÃO FINANCEIRA"));
    boleto.setLocaisDePagamento(locaisPagamento);

    List<InformacaoModel> instrucoes = new ArrayList<>();
    instrucoes.add(new InformacaoModel("PROTESTO AUTOMÁTICO APÓS 5 DIAS DO VENCIMENTO"));
    boleto.setInstrucoes(instrucoes);

    boleto.setTipoJuros(TipoJurosEnum.PERCENTUAL_MENSAL);
    boleto.setDiasJuros(1);
    boleto.setValorPercentualJuros(BigDecimal.valueOf(9.9));
    boleto.setTipoMulta(TipoMultaEnum.PERCENTUAL);
    boleto.setDiasMulta(1);
    boleto.setValorPercentualMulta(BigDecimal.valueOf(2.00));
    boleto.setTipoDesconto(TipoDescontoEnum.PERCENTUAL_DIA);
    boleto.setProtesto(true);
    boleto.setDiasProtesto(5);
    boleto.setNegativacaoAutomatica(false);
    boleto.setTipoImpressao("A");
    boleto.setEspecieMoeda("REAL");

    return boleto;
}
```