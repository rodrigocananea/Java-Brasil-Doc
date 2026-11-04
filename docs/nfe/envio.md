# Envio NF-e/NFC-e

O fluxo de envio é sempre o mesmo:

1. Gerar a chave com `ChaveUtil`.
2. Preencher o `InfNFe` (ide, emit, dest, det, total, transp, pag...).
3. Montar o `TEnviNFe`, assinar e validar com `Nfe.montaNfe`.
4. Enviar com `Nfe.enviarNfe` e tratar o retorno síncrono ou assíncrono.
5. Gerar o XML final (`nfeProc`) com `XmlNfeUtil.criaNfeProc`.

::: warning Reforma Tributária
Desde a NT 2025.002-RTC a homologação **rejeita a NF-e modelo 55 sem o grupo `IBSCBS`** (cStat `1115 - Grupo IBSCBS não informado`). Os exemplos abaixo já montam o grupo por item e os totais `IBSCBSTot` / `vNFTot` com o `IbsCbsUtil`. Detalhes em [Reforma Tributária (IBS/CBS)](./reforma-tributaria.md).
:::

::: tip Imports
Desde a v4.1 todas as classes do leiaute ficam no package `br.com.swconsultoria.nfe.schemas`. Se o seu código ainda usa `schema_4.enviNFe.*`, veja [Migração v4.00 → v4.1](./migracao.md).
:::

### Envio NF-e (Síncrono)
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.enuns.DocumentoEnum;
import br.com.swconsultoria.nfe.dom.enuns.StatusEnum;
import br.com.swconsultoria.nfe.schemas.*;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Det.Imposto;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Det.Imposto.COFINS;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Det.Imposto.COFINS.COFINSAliq;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Det.Imposto.PIS;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Det.Imposto.PIS.PISAliq;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Det.Prod;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Total;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Total.ICMSTot;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Transp;
import br.com.swconsultoria.nfe.util.*;

import javax.xml.bind.JAXBElement;
import javax.xml.namespace.QName;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * @author Samuel Oliveira
 */
public class EnvioNfeTeste {

    /** cClassTrib do item (000001 = tributação integral). */
    private static final String C_CLASS_TRIB = "000001";

    /** Preenchido em preencheDet e consumido em preencheTotal. */
    private static IbsCbsUtil ibsCbsUtil;

    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            //Informe o Numero da NFe
            int numeroNfe = 1;
            //Informe o CNPJ do Emitente da NFe
            String cnpj = "XXX";
            //Informe a data de Emissao da NFe
            LocalDateTime dataEmissao = LocalDateTime.now();
            //Informe o cNF da NFe com 8 digitos (aleatório)
            String cnf = String.format("%08d", new Random().nextInt(99999999));
            //Informe o modelo da NFe
            String modelo = DocumentoEnum.NFE.getModelo();
            //Informe a Serie da NFe
            int serie = 1;
            //Informe o tipo de Emissao da NFe
            String tipoEmissao = "1";

            // Monta a Chave da NFe
            ChaveUtil chaveUtil = new ChaveUtil(config.getEstado(), cnpj, modelo, serie, numeroNfe, tipoEmissao, cnf, dataEmissao);
            String chave = chaveUtil.getChaveNF();
            String cdv = chaveUtil.getDigitoVerificador();

            InfNFe infNFe = new InfNFe();
            infNFe.setId(chave);
            infNFe.setVersao(ConstantesUtil.VERSAO.NFE);

            //Preenche IDE
            infNFe.setIde(preencheIde(config, cnf, numeroNfe, tipoEmissao, modelo, serie, cdv, dataEmissao));
            //Preenche Emitente
            infNFe.setEmit(preencheEmitente(config, cnpj));
            //Preenche o Destinatario
            infNFe.setDest(preencheDestinatario());
            //Preenche os dados do Produto da Nfe (inclui o grupo IBSCBS)
            infNFe.getDet().addAll(preencheDet(infNFe));
            //Preenche totais da NFe (inclui IBSCBSTot e vNFTot)
            infNFe.setTotal(preencheTotal());
            //Preenche os dados de Transporte
            infNFe.setTransp(preencheTransporte());
            //Preenche dados Pagamento
            infNFe.setPag(preenchePag());

            TNFe nfe = new TNFe();
            nfe.setInfNFe(infNFe);

            // Monta EnviNfe
            TEnviNFe enviNFe = new TEnviNFe();
            enviNFe.setVersao(ConstantesUtil.VERSAO.NFE);
            enviNFe.setIdLote("1");
            enviNFe.setIndSinc("1");
            enviNFe.getNFe().add(nfe);

            // Monta e Assina o XML
            enviNFe = Nfe.montaNfe(config, enviNFe, true);

            // Envia a Nfe para a Sefaz
            TRetEnviNFe retorno = Nfe.enviarNfe(config, enviNFe, DocumentoEnum.NFE);

            //Valida se o Retorno é Assincrono
            if (RetornoUtil.isRetornoAssincrono(retorno)) {
                //Pega o Recibo
                String recibo = retorno.getInfRec().getNRec();
                int tentativa = 0;
                TRetConsReciNFe retornoNfe = null;

                //Define Numero de tentativas que irá tentar a Consulta
                while (tentativa < 15) {
                    retornoNfe = Nfe.consultaRecibo(config, recibo, DocumentoEnum.NFE);
                    if (retornoNfe.getCStat().equals(StatusEnum.LOTE_EM_PROCESSAMENTO.getCodigo())) {
                        System.out.println("INFO: Lote Em Processamento, vai tentar novamente apos 1 Segundo.");
                        Thread.sleep(1000);
                        tentativa++;
                    } else {
                        break;
                    }
                }

                RetornoUtil.validaAssincrono(retornoNfe);
                System.out.println();
                System.out.println("# Status: " + retornoNfe.getProtNFe().get(0).getInfProt().getCStat() + " - " + retornoNfe.getProtNFe().get(0).getInfProt().getXMotivo());
                System.out.println("# Protocolo: " + retornoNfe.getProtNFe().get(0).getInfProt().getNProt());
                System.out.println("# XML Final: " + XmlNfeUtil.criaNfeProc(enviNFe, retornoNfe.getProtNFe().get(0)));

            } else {
                //Se for else o Retorno é Sincrono

                //Valida Retorno Sincrono
                RetornoUtil.validaSincrono(retorno);
                System.out.println();
                System.out.println("# Status: " + retorno.getProtNFe().getInfProt().getCStat() + " - " + retorno.getProtNFe().getInfProt().getXMotivo());
                System.out.println("# Protocolo: " + retorno.getProtNFe().getInfProt().getNProt());
                System.out.println("# Xml Final :" + XmlNfeUtil.criaNfeProc(enviNFe, retorno.getProtNFe()));
            }

        } catch (Exception e) {
            System.err.println();
            System.err.println("# Erro: " + e.getMessage());
        }
    }

    private static InfNFe.Ide preencheIde(ConfiguracoesNfe config, String cnf, int numeroNfe, String tipoEmissao, String modelo, int serie, String cDv, LocalDateTime dataEmissao) {
        InfNFe.Ide ide = new InfNFe.Ide();
        ide.setCUF(config.getEstado().getCodigoUF());
        ide.setCNF(cnf);
        ide.setNatOp("VENDA");
        ide.setMod(modelo);
        ide.setSerie(String.valueOf(serie));
        ide.setNNF(String.valueOf(numeroNfe));
        ide.setDhEmi(XmlNfeUtil.dataNfe(dataEmissao, config.getZoneId()));
        ide.setTpNF("1");
        ide.setIdDest("1");
        ide.setCMunFG("5219753");
        ide.setTpImp("1");
        ide.setTpEmis(tipoEmissao);
        ide.setCDV(cDv);
        ide.setTpAmb(config.getAmbiente().getCodigo());
        ide.setFinNFe("1");
        ide.setIndFinal("1");
        ide.setIndPres("1");
        ide.setProcEmi("0");
        ide.setVerProc("1.0");
        return ide;
    }

    private static InfNFe.Emit preencheEmitente(ConfiguracoesNfe config, String cnpj) {
        InfNFe.Emit emit = new InfNFe.Emit();
        emit.setCNPJ(cnpj);
        emit.setXNome("XXX");

        TEnderEmi enderEmit = new TEnderEmi();
        enderEmit.setXLgr("AV SANTO ANTONIO");
        enderEmit.setNro("0");
        enderEmit.setXBairro("PQ STO ANTONIO");
        enderEmit.setCMun("5219753");
        enderEmit.setXMun("SANTO ANTONIO DO DESCOBERTO");
        enderEmit.setUF(TUfEmi.valueOf(config.getEstado().toString()));
        enderEmit.setCEP("72900000");
        enderEmit.setCPais("1058");
        enderEmit.setXPais("Brasil");
        enderEmit.setFone("6233215175");
        emit.setEnderEmit(enderEmit);

        emit.setIE("XXX");
        emit.setCRT("3");
        return emit;
    }

    private static InfNFe.Dest preencheDestinatario() {
        InfNFe.Dest dest = new InfNFe.Dest();
        dest.setCNPJ("XXX");
        dest.setXNome("NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL");

        TEndereco enderDest = new TEndereco();
        enderDest.setXLgr("Rua: Teste");
        enderDest.setNro("0");
        enderDest.setXBairro("TESTE");
        enderDest.setCMun("5202809");
        enderDest.setXMun("AVELINOPOLIS");
        enderDest.setUF(TUf.GO);
        enderDest.setCEP("74430130");
        enderDest.setCPais("1058");
        enderDest.setXPais("Brasil");
        dest.setEnderDest(enderDest);
        dest.setIE("XXX");
        dest.setIndIEDest("1");
        return dest;
    }

    /**
     * O grupo IBSCBS é exigido pela SEFAZ (rejeição 1115 sem ele).
     * O ano da monofasia sai do dhEmi do próprio ide, para não divergir do documento.
     */
    private static List<InfNFe.Det> preencheDet(InfNFe infNFe) throws Exception {
        // ibscbs.json: tabela de CST/cClassTrib publicada pela SEFAZ (ver ConsultaTributacao) (2)
        ibsCbsUtil = new IbsCbsUtil(XmlNfeUtil.leXml("d:/nfe/ibscbs.json"), DocumentoEnum.NFE, infNFe);

        InfNFe.Det det = new InfNFe.Det();
        //O numero do Item deve seguir uma sequencia
        det.setNItem("1");
        det.setProd(preencheProduto());
        det.setImposto(preencheImposto());

        //Calcula e monta o grupo IBSCBS do item
        TTribNFe ibsCbs = ibsCbsUtil.montaImpostosDet(C_CLASS_TRIB, det);
        det.getImposto().getContent().add(new JAXBElement<>(new QName("IBSCBS"), TTribNFe.class, ibsCbs));

        return Collections.singletonList(det);
    }

    private static Prod preencheProduto() {
        Prod prod = new Prod();
        prod.setCProd("7898480650104");
        prod.setCEAN("7898480650104");
        prod.setXProd("NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL");
        prod.setNCM("27101932");
        prod.setCEST("0600500");
        prod.setIndEscala("S");
        prod.setCFOP("5405");
        prod.setUCom("UN");
        prod.setQCom("1.0000");
        prod.setVUnCom("13.0000");
        prod.setVProd("13.00");
        prod.setCEANTrib("7898480650104");
        prod.setUTrib("UN");
        prod.setQTrib("1.0000");
        prod.setVUnTrib("13.0000");
        prod.setIndTot("1");
        return prod;
    }

    private static Imposto preencheImposto() {
        Imposto imposto = new Imposto();

        Imposto.ICMS icms = new Imposto.ICMS();
        Imposto.ICMS.ICMS60 icms60 = new Imposto.ICMS.ICMS60();
        icms60.setOrig("0");
        icms60.setCST("60");
        icms60.setVBCSTRet("0.00");
        icms60.setPST("0.00");
        icms60.setVICMSSTRet("0.00");
        icms60.setVICMSSubstituto("0.00");
        icms.setICMS60(icms60);

        PIS pis = new PIS();
        PISAliq pisAliq = new PISAliq();
        pisAliq.setCST("01");
        pisAliq.setVBC("13.00");
        pisAliq.setPPIS("1.65");
        pisAliq.setVPIS("0.21");
        pis.setPISAliq(pisAliq);

        COFINS cofins = new COFINS();
        COFINSAliq cofinsAliq = new COFINSAliq();
        cofinsAliq.setCST("01");
        cofinsAliq.setVBC("13.00");
        cofinsAliq.setPCOFINS("7.60");
        cofinsAliq.setVCOFINS("0.99");
        cofins.setCOFINSAliq(cofinsAliq);

        ObjectFactory factory = new ObjectFactory();
        imposto.getContent().add(factory.createTNFeInfNFeDetImpostoVTotTrib("5.00"));
        imposto.getContent().add(factory.createTNFeInfNFeDetImpostoICMS(icms));
        // Se a empresa/tributação exigir IPI: factory.createTNFeInfNFeDetImpostoIPI(ipi)
        imposto.getContent().add(factory.createTNFeInfNFeDetImpostoPIS(pis));
        imposto.getContent().add(factory.createTNFeInfNFeDetImpostoCOFINS(cofins));
        return imposto;
    }

    private static Total preencheTotal() {
        Total total = new Total();
        ICMSTot icmstot = new ICMSTot();
        icmstot.setVBC("0.00");
        icmstot.setVICMS("0.00");
        icmstot.setVICMSDeson("0.00");
        icmstot.setVFCP("0.00");
        icmstot.setVFCPST("0.00");
        icmstot.setVFCPSTRet("0.00");
        icmstot.setVBCST("0.00");
        icmstot.setVST("0.00");
        icmstot.setVProd("13.00");
        icmstot.setVFrete("0.00");
        icmstot.setVSeg("0.00");
        icmstot.setVDesc("0.00");
        icmstot.setVII("0.00");
        icmstot.setVIPI("0.00");
        icmstot.setVIPIDevol("0.00");
        icmstot.setVPIS("0.21");
        icmstot.setVCOFINS("0.99");
        icmstot.setVOutro("0.00");
        icmstot.setVNF("13.00");
        icmstot.setVTotTrib("5.00");
        total.setICMSTot(icmstot);

        //Totais do IBS/CBS acumulados pelo IbsCbsUtil e o total geral do documento (vNFTot)
        total.setIBSCBSTot(ibsCbsUtil.preencheTotaisIbsCsb());
        BigDecimal vNfTot = ibsCbsUtil.calculaVnfTot(icmstot.getVNF());
        total.setVNFTot(ObjetoUtil.getValor2Casas(vNfTot));
        return total;
    }

    private static Transp preencheTransporte() {
        Transp transp = new Transp();
        transp.setModFrete("9");
        return transp;
    }

    private static InfNFe.Pag preenchePag() {
        InfNFe.Pag pag = new InfNFe.Pag();
        InfNFe.Pag.DetPag detPag = new InfNFe.Pag.DetPag();
        detPag.setTPag("01");
        detPag.setVPag("13.00");
        pag.getDetPag().add(detPag);
        return pag;
    }
}
```

1.  Acesse o menu [Configurações (Certificado)](./configuracoes.md)
2.  O JSON pode ser baixado/consultado com `ConsultaTributacao.getJson(config)` — veja [Reforma Tributária](./reforma-tributaria.md#consulta-da-tabela-cst-cclasstrib).

::: details Combustíveis (monofasia)
Para `cClassTrib` de combustíveis (`620*`) a SEFAZ exige, além do grupo `IBSCBS`:
- o grupo `comb` no produto (`cProdANP`, `descANP`, `UFCons`, `pBio`), senão rejeição `1106`;
- ICMS **61** em vez de 60 na monofasia retida anteriormente (`620004`, `620005`, `620006`), senão rejeição `858`;
- `cBenef` quando o estado exigir (rejeição `930`) e unidade em litro (rejeição `854`);
- `qBCMonoRet` / `vICMSMonoRet` também no `ICMSTot`.

Na monofasia retida anteriormente informe o valor retido com `ibsCbsUtil.setVIBSMonoRet(...)` e `ibsCbsUtil.setVCBSMonoRet(...)`. Enquanto a tabela por produto não for publicada a SEFAZ calcula zero e recusa outro valor (rejeição `1240`), então informe `0.00`.

O exemplo completo está em [EnvioNfeTeste.java](https://github.com/Samuel-Oliveira/Java_NFe/blob/master/src/test/java/br/com/swconsultoria/nfe/exemplos/EnvioNfeTeste.java) (execute com `-DcClassTrib=620006`).
:::

### Envio NFC-e (Síncrono)

A montagem é igual à da NF-e, com estas diferenças:

- `modelo = DocumentoEnum.NFCE.getModelo()` (65), `tpImp = 4` e envio com `DocumentoEnum.NFCE`;
- o `IbsCbsUtil` é criado com `DocumentoEnum.NFCE` (o grupo `IBSCBS` do item continua sendo montado com `montaImpostosDet`, que devolve `TTribNFe`);
- após `Nfe.montaNfe` é obrigatório informar o `infNFeSupl` com o **QR Code**.

```java
import br.com.swconsultoria.nfe.dom.enuns.ServicosEnum;
import br.com.swconsultoria.nfe.util.NFCeUtil;
import br.com.swconsultoria.nfe.util.WebServiceUtil;

// ... preenchimento do infNFe igual ao da NF-e, com modelo 65 e tpImp 4 ...

// Monta e Assina o XML
enviNFe = Nfe.montaNfe(config, enviNFe, true);

// Monta o QR Code (versão 3 - NT 2025.001)
String qrCode = NFCeUtil.getCodeQRCodeV3(
        enviNFe.getNFe().get(0).getInfNFe().getId().substring(3),   // chave sem o "NFe"
        config.getAmbiente().getCodigo(),
        WebServiceUtil.getUrl(config, DocumentoEnum.NFCE, ServicosEnum.URL_QRCODE));

TNFe.InfNFeSupl infNFeSupl = new TNFe.InfNFeSupl();
infNFeSupl.setQrCode(qrCode);
infNFeSupl.setUrlChave(WebServiceUtil.getUrl(config, DocumentoEnum.NFCE, ServicosEnum.URL_CONSULTANFCE));
enviNFe.getNFe().get(0).setInfNFeSupl(infNFeSupl);

// Envia a NFC-e para a Sefaz
TRetEnviNFe retorno = Nfe.enviarNfe(config, enviNFe, DocumentoEnum.NFCE);
// ... tratamento do retorno igual ao da NF-e ...
```

::: warning QR Code v2 (CSC)
O padrão v3 do QR Code (NT 2025.001) **não usa mais o CSC/idToken** na emissão online. Os métodos `NFCeUtil.getCodeQRCode(chave, ambiente, idToken, csc, url)` e `getCodeQRCodeContingencia(...)` (v2) estão marcados para remoção: use `getCodeQRCodeV3` e `getCodeQRCodeContingenciaV3`.
:::

#### NFC-e em contingência off-line (tpEmis = 9)

Gere a chave e o `ide` com `tpEmis = 9` e informe a justificativa e a data/hora de entrada em contingência:

```java
ide.setTpEmis("9");
ide.setXJust("Emissor sem Internet");
ide.setDhCont(XmlNfeUtil.dataNfe(dataEmissao, config.getZoneId()));
```

Na contingência off-line o QR Code v3 leva o dia da emissão, o valor da nota, a identificação do destinatário e é assinado com o certificado:

```java
TNFe.InfNFe infNFe = enviNFe.getNFe().get(0).getInfNFe();
String qrCode = NFCeUtil.getCodeQRCodeContingenciaV3(
        infNFe.getId().substring(3),
        config.getAmbiente().getCodigo(),
        infNFe.getIde().getDhEmi(),
        infNFe.getTotal().getICMSTot().getVNF(),
        "2",                    // tpDestinatario: 1=CNPJ, 2=CPF, 3=idEstrangeiro (null se não identificado)
        "12345678909",          // CPF/CNPJ do destinatário (null se não identificado)
        WebServiceUtil.getUrl(config, DocumentoEnum.NFCE, ServicosEnum.URL_QRCODE),
        config.getCertificado());
```

Depois, ao transmitir a nota emitida em contingência, valide o retorno com `RetornoUtil.validaSincronoTrasmissaoContingencia(retorno)`. Exemplo de montagem em [EnvioNfceContingenciaTeste.java](https://github.com/Samuel-Oliveira/Java_NFe/blob/master/src/test/java/br/com/swconsultoria/nfe/exemplos/EnvioNfceContingenciaTeste.java) (o exemplo do repositório ainda usa o QR Code v2).

### Envio NF-e com arquivo XML
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.enuns.DocumentoEnum;
import br.com.swconsultoria.nfe.schemas.TEnviNFe;
import br.com.swconsultoria.nfe.schemas.TRetEnviNFe;
import br.com.swconsultoria.nfe.util.RetornoUtil;
import br.com.swconsultoria.nfe.util.XmlNfeUtil;

/**
 * @author Samuel Oliveira
 */
public class EnvioNfeXmlTeste {

    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            // Le Xml do Arquivo (enviNFe)
            String xml = XmlNfeUtil.leXml("d:/teste/nfe.xml");
            TEnviNFe enviNFe = XmlNfeUtil.xmlToObject(xml, TEnviNFe.class);

            // Monta e Assina o XML (não chame se o XML já estiver assinado)
            enviNFe = Nfe.montaNfe(config, enviNFe, true);

            // Envia a Nfe para a Sefaz
            TRetEnviNFe retorno = Nfe.enviarNfe(config, enviNFe, DocumentoEnum.NFE);

            // ... tratamento do retorno síncrono/assíncrono igual ao exemplo acima ...
            RetornoUtil.validaSincrono(retorno);
            System.out.println("# Xml Final : " + XmlNfeUtil.criaNfeProc(enviNFe, retorno.getProtNFe()));

        } catch (Exception e) {
            System.err.println();
            System.err.println("# Erro: " + e.getMessage());
        }
    }
}
```

1.  Acesse o menu [Configurações (Certificado)](./configuracoes.md)

### Utilitários úteis

| Método | Descrição |
|---|---|
| `XmlNfeUtil.objectToXml(objeto)` | Converte qualquer objeto do leiaute em XML. |
| `XmlNfeUtil.xmlToObject(xml, Classe.class)` | Converte XML no objeto. |
| `XmlNfeUtil.dataNfe(LocalDateTime, ZoneId)` | Formata data no padrão da NF-e (com offset). |
| `XmlNfeUtil.leXml(caminho)` | Lê um arquivo XML como String. |
| `XmlNfeUtil.getTag(xml, tag)` | Extrai uma tag de um XML. |
| `NFCeUtil.geraHashCSRT(chave, csrt)` | Gera o `hashCSRT` do Responsável Técnico (NT 2018.005). |
| `Nfe.enviarEnventoManual(config, xml, ServicosEnum, valida, assina, DocumentoEnum)` | Envia um XML de evento montado manualmente (opcionalmente sem assinar). |
