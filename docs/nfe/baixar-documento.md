# Baixar Documento (DistDfe)

Função para consulta/download de NF-e e eventos destinados ao CNPJ/CPF do certificado, via serviço de Distribuição DF-e do Ambiente Nacional.

Tipos de consulta (`ConsultaDFeEnum`):

| Tipo | Descrição |
|---|---|
| `NSU` | Retorna os documentos a partir do último NSU informado (até 50 por consulta). |
| `NSU_UNICO` | Retorna somente o documento do NSU informado. |
| `CHAVE` | Retorna o documento da chave de acesso informada. |

### Consulta via NSU (percorrendo até o último NSU)
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.enuns.ConsultaDFeEnum;
import br.com.swconsultoria.nfe.dom.enuns.PessoaEnum;
import br.com.swconsultoria.nfe.dom.enuns.StatusEnum;
import br.com.swconsultoria.nfe.schemas.RetDistDFeInt;
import br.com.swconsultoria.nfe.schemas.RetDistDFeInt.LoteDistDFeInt.DocZip;
import br.com.swconsultoria.nfe.util.XmlNfeUtil;

import java.util.List;

/**
 * @author Samuel Oliveira
 */
public class DistribuicaoDFeTeste {

    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            //Informe o CNPJ Do Destinatario (Deve ser o Mesmo do Certificado)
            String cnpj = "XXX";

            //Informe o último NSU que você já processou (guarde-o no seu banco)
            String nsu = "000000000000000";

            RetDistDFeInt retorno;
            while (true) {
                retorno = Nfe.distribuicaoDfe(config, PessoaEnum.JURIDICA, cnpj, ConsultaDFeEnum.NSU, nsu);

                if (StatusEnum.DOC_LOCALIZADO_PARA_DESTINATARIO.getCodigo().equals(retorno.getCStat())) {
                    System.out.println("# Status: " + retorno.getCStat() + " - " + retorno.getXMotivo());
                    System.out.println("# NSU Atual: " + retorno.getUltNSU());
                    System.out.println("# Max NSU: " + retorno.getMaxNSU());

                    //Aqui Recebe a Lista De XML (No Maximo 50 por Consulta)
                    List<DocZip> listaDoc = retorno.getLoteDistDFeInt().getDocZip();
                    for (DocZip docZip : listaDoc) {
                        switch (docZip.getSchema()) {
                            case "resNFe_v1.01.xsd":
                                System.out.println("# XML em resumo: faça a Manifestação para obter o XML completo.");
                                break;
                            case "procNFe_v4.00.xsd":
                                System.out.println("# XML Completo.");
                                break;
                            case "procEventoNFe_v1.00.xsd":
                                System.out.println("# XML Evento.");
                                break;
                            default:
                                System.out.println("# Schema não tratado: " + docZip.getSchema());
                        }
                        //Transforma o GZip em XML
                        String xml = XmlNfeUtil.gZipToXml(docZip.getValue());
                        System.out.println("# XML: " + xml);
                    }
                } else {
                    System.out.println("# Status: " + retorno.getCStat() + " - " + retorno.getXMotivo());
                }

                //Chegou ao fim da fila
                if (retorno.getUltNSU().equals(retorno.getMaxNSU())) {
                    break;
                }
                nsu = retorno.getUltNSU();
            }

        } catch (Exception e) {
            System.err.println();
            System.err.println("# Erro: " + e.getMessage());
        }
    }
}
```

1.  Acesse o menu [Configurações (Certificado)](./configuracoes.md)

::: warning Consumo indevido
A SEFAZ bloqueia temporariamente (cStat `656`) quem consulta sem necessidade. Quando `ultNSU` for igual a `maxNSU`, aguarde ao menos 1 hora antes de consultar novamente.
:::

### Consulta via Chave
```java
String chave = "35170843283811001202550010046314601229130549";
RetDistDFeInt retorno = Nfe.distribuicaoDfe(config, PessoaEnum.JURIDICA, cnpj, ConsultaDFeEnum.CHAVE, chave);
```

### Consulta de um NSU específico
```java
RetDistDFeInt retorno = Nfe.distribuicaoDfe(config, PessoaEnum.JURIDICA, cnpj, ConsultaDFeEnum.NSU_UNICO, "000000000001234");
```
