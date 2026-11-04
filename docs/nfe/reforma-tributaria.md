# Reforma Tributária (IBS / CBS / IS)

A biblioteca calcula e preenche automaticamente o grupo **`IBSCBS`** de cada item e os totais **`IBSCBSTot`** / **`vNFTot`** a partir do `cClassTrib`, usando a tabela oficial de CST/cClassTrib publicada pela SEFAZ.

::: warning Obrigatório em homologação
A SEFAZ já rejeita NF-e modelo 55 sem o grupo `IBSCBS` (cStat `1115 - Grupo IBSCBS não informado`).
:::

## Consulta da tabela CST / cClassTrib

A classe `ConsultaTributacao` consulta a API da SEFAZ com a tabela de classificações tributárias (CFF). O resultado pode ser usado direto no `IbsCbsUtil` ou salvo em arquivo (`ibscbs.json`) para não consultar a cada emissão.

```java
import br.com.swconsultoria.nfe.ConsultaTributacao;
import br.com.swconsultoria.nfe.dto.CstDTO;
import com.fasterxml.jackson.core.type.TypeReference;

// 1. JSON bruto (para salvar em arquivo/cache)
String json = ConsultaTributacao.getJson(config);

// 2. Já convertido em DTOs
List<CstDTO> lista = ConsultaTributacao.get(config, new TypeReference<List<CstDTO>>() {});
for (CstDTO cst : lista) {
    System.out.println(cst.getCst() + " - " + cst.getDescricaoCST()
            + " | vigência: " + cst.getInicioVigencia() + " a " + cst.getFimVigencia());
}

// 3. Com filtro (parâmetros da API)
Map<String, String> parametros = new HashMap<>();
parametros.put("Cst", "00");
List<CstDTO> filtrado = ConsultaTributacao.get(config, parametros, new TypeReference<List<CstDTO>>() {});

// 4. Verificar se o seu DTO continua compatível com o JSON da API
ConsultaTributacao.ValidationReport report = ConsultaTributacao.validate(config, MeuCstDTO.class);
if (!report.isValid()) {
    report.getExtraFields().forEach(f -> System.out.println("Campo novo no JSON: " + f));
    report.getMissingFields().forEach(f -> System.out.println("Campo ausente no JSON: " + f));
    report.getTypeErrors().forEach((f, erro) -> System.out.println(f + ": " + erro));
}
```

Exemplo completo: [ConsultaTributacaoTeste.java](https://github.com/Samuel-Oliveira/Java_NFe/blob/master/src/test/java/br/com/swconsultoria/nfe/exemplos/ConsultaTributacaoTeste.java).

## Cálculo do IBS/CBS com `IbsCbsUtil`

```java
import br.com.swconsultoria.nfe.schemas.TTribNFe;
import br.com.swconsultoria.nfe.util.IbsCbsUtil;
import br.com.swconsultoria.nfe.util.ObjetoUtil;

// 1. Cria o utilitário a partir do JSON (ou de uma List<CstDTO>).
//    Passando o InfNFe, o ano de emissão é lido do próprio dhEmi da nota (recomendado).
IbsCbsUtil ibsCbsUtil = new IbsCbsUtil(json, DocumentoEnum.NFE, infNFe);

// 2. Para cada item: calcula e adiciona o grupo IBSCBS
for (TNFe.InfNFe.Det det : infNFe.getDet()) {
    TTribNFe ibsCbs = ibsCbsUtil.montaImpostosDet("000001", det);
    det.getImposto().getContent().add(new JAXBElement<>(new QName("IBSCBS"), TTribNFe.class, ibsCbs));
}

// 3. Totais: o IbsCbsUtil acumulou os valores de todos os itens
total.setIBSCBSTot(ibsCbsUtil.preencheTotaisIbsCsb());
total.setVNFTot(ObjetoUtil.getValor2Casas(ibsCbsUtil.calculaVnfTot(icmsTot.getVNF())));
```

::: tip Uma instância por nota
O `IbsCbsUtil` acumula os totais dos itens. Crie **uma instância por documento** e não a compartilhe entre notas (nem entre threads). A lista de `CstDTO` pode ser reaproveitada.
:::

### Construtores

| Construtor | Uso |
|---|---|
| `IbsCbsUtil(String json, DocumentoEnum doc)` | JSON da tabela; ano de emissão = ano corrente. |
| `IbsCbsUtil(List<CstDTO> lista, DocumentoEnum doc)` | Lista já convertida (ex.: cache). |
| `IbsCbsUtil(json \| lista, doc, String dhEmi)` | Ano extraído do `dhEmi` informado. |
| `IbsCbsUtil(json \| lista, doc, TNFe.InfNFe infNFe)` | Ano extraído do `ide/dhEmi` da nota (**recomendado**). |

### cClassTrib com tributação regular

Quando o `cClassTrib` exige a tributação regular (ex.: `550001`), informe o `cClassTrib` regular no terceiro parâmetro:

```java
TTribNFe ibsCbs = ibsCbsUtil.montaImpostosDet("550001", det, "000001");
```

### Parâmetros opcionais

Alguns grupos dependem de informações que não estão na tabela e devem ser informados **antes** de chamar `montaImpostosDet`:

| Setter | Quando usar |
|---|---|
| `setpAliqIbsUf`, `setpAliqIbsMun`, `setpAliqCbs` | Alíquotas de IBS UF, IBS Município e CBS (padrão do período de teste: IBS 0,1% e CBS 0,9%). |
| `setpAliqDiferimento` | Percentual de diferimento. |
| `setCCredPres`, `setPCredPresIBS`, `setPCredPresCBS` | Crédito presumido (`IndCredPresOper`). |
| `setTpCredPresIBSZFM` | Crédito presumido IBS Zona Franca de Manaus. |
| `setCompetApur` | Competência do ajuste (`gAjusteCompet`). |
| `setTpEnteGov`, `setPRedutorCompraGov`, `setTpOperGov` | Compras governamentais (`gTribCompraGov`). |
| `setAnoEmissao` / `setDhEmi` | Ano que define a modalidade da monofasia (prefira os construtores com `dhEmi`/`InfNFe`). |

### Combustíveis (monofasia)

A modalidade dos grupos monofásicos depende do **ano de emissão** (NT 2025.002-RTC, regras UB85a/UB95a):

| Ano | IBS | CBS |
|---|---|---|
| 2026 | Ad valorem | Ad valorem |
| 2027 | Ad valorem | Ad rem |
| 2028 | Ad valorem | Ad rem |
| 2029+ | Ad rem | Ad rem |

Informar a modalidade errada é rejeitado (cStat `1219`, `1220`, `1245`, `1246`, `1259`). Por isso o ano deve coincidir com o `dhEmi` da nota — use o construtor que recebe o `InfNFe`.

Setters específicos da monofasia:

| Setter | Descrição |
|---|---|
| `setAdRemIBS`, `setAdRemCBS` | Alíquotas ad rem (R$ por unidade) — `gMonoPadrao`. |
| `setAdRemIBSReten`, `setAdRemCBSReten`, `setQBCMonoReten` | Monofasia sujeita a retenção. |
| `setPAliqMonoUF`, `setPAliqMonoMun`, `setPAliqMonoCBS` | Alíquotas ad valorem. |
| `setPAliqMonoRetenIBS`, `setPAliqMonoRetenCBS` | Alíquotas ad valorem da retenção. |
| `setVIBSMonoRet`, `setVCBSMonoRet` | Valor retido anteriormente (`gMonoRet`). |
| `setPBioObrig`, `setQBCBioComb`, `setAdRemIBSBioComb`, `setAdRemCBSBioComb`, `setVIBSDiferenca`, `setVCBSDiferenca` | Diferença de biocombustível (`gpBioDiferenca`). |

::: warning Monofasia retida anteriormente (620004, 620005, 620006)
O grupo `gMonoRet` leva só o valor; a SEFAZ o confere por uma tabela por produto que **ainda não foi publicada**. Hoje ela calcula zero e recusa outro valor com cStat `1240`: informe `0.00` em `setVIBSMonoRet` / `setVCBSMonoRet` até a tabela sair.
:::

Veja também os requisitos do grupo `comb`, ICMS 61 e `cBenef` em [Envio → Combustíveis](./envio.md).

## Leitura do grupo IBSCBS

Veja [Ler XML](./ler-xml.md#lendo-os-grupos-de-impostos-manualmente).

## Exemplos no repositório

- [EnvioNfeTeste.java](https://github.com/Samuel-Oliveira/Java_NFe/blob/master/src/test/java/br/com/swconsultoria/nfe/exemplos/EnvioNfeTeste.java) — NF-e com IBSCBS (e monofasia com `-DcClassTrib=620006`).
- [EnvioNfceTeste.java](https://github.com/Samuel-Oliveira/Java_NFe/blob/master/src/test/java/br/com/swconsultoria/nfe/exemplos/EnvioNfceTeste.java) — NFC-e de combustíveis (gasolina, etanol e diesel).
- [IbsCbsTest.java](https://github.com/Samuel-Oliveira/Java_NFe/blob/master/src/test/java/br/com/swconsultoria/nfe/exemplos/IbsCbsTest.java) — cálculos com `cClassTrib` integral e regular.
