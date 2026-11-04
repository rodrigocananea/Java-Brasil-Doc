# Consulta Situação

Função para consultar a Situação da NF-e/NFC-e na Sefaz.

### Consulta pela chave
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.enuns.DocumentoEnum;
import br.com.swconsultoria.nfe.schemas.TRetConsSitNFe;
import br.com.swconsultoria.nfe.util.XmlNfeUtil;

/**
 * @author Samuel Oliveira
 */
public class ConsultaXmlTeste {
    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            //Informe a chave a ser Consultada
            String chave = "52190310732644000128550010000125531000125532";

            //Efetua a consulta
            TRetConsSitNFe retorno = Nfe.consultaXml(config, chave, DocumentoEnum.NFE);

            //Resultado
            System.out.println("# Status: " + retorno.getCStat() + " - " + retorno.getXMotivo());
            System.out.println("# XML: " + XmlNfeUtil.objectToXml(retorno));
        } catch (Exception e) {
            System.err.println();
            System.err.println(e.getMessage());
        }
    }
}
```

1.  Acesse o menu [Configurações (Certificado)](./configuracoes.md)

### Recuperar o ProcEvento de uma nota cancelada

Quando a consulta retorna `101` (cancelada) e você não guardou o XML do evento, é possível remontar o `procEventoNFe` a partir dos dados do protocolo:

```java
import br.com.swconsultoria.nfe.schemas.TProtNFe;
import br.com.swconsultoria.nfe.schemas_eventos.TEnvEventoCancelamento;
import br.com.swconsultoria.nfe.schemas_eventos.TRetEventoCancelamento;
import br.com.swconsultoria.nfe.util.CancelamentoUtil;

if (retorno.getCStat().equals("101")) {
    TProtNFe retCancNFe = retorno.getProtNFe();

    TRetEventoCancelamento retCance = new TRetEventoCancelamento();
    retCance.setVersao("1.00");
    TRetEventoCancelamento.InfEvento infEvento = new TRetEventoCancelamento.InfEvento();
    infEvento.setTpAmb(retCancNFe.getInfProt().getTpAmb());
    infEvento.setVerAplic(retCancNFe.getInfProt().getVerAplic());
    infEvento.setCOrgao(EstadosEnum.GO.getCodigoUF());
    infEvento.setCStat("135");
    infEvento.setXMotivo("Evento registrado e vinculado a NF-e");
    infEvento.setChNFe(retCancNFe.getInfProt().getChNFe());
    infEvento.setTpEvento("110111");
    infEvento.setXEvento("Cancelamento registrado");
    infEvento.setNSeqEvento("1");
    infEvento.setDhRegEvento(retCancNFe.getInfProt().getDhRecbto()); // String desde a v4.1
    infEvento.setNProt(retCancNFe.getInfProt().getNProt());
    retCance.setInfEvento(infEvento);

    // Mesmos dados usados no cancelamento original
    Evento cancela = new Evento();
    cancela.setChave(chave);
    cancela.setProtocolo("XXX");
    cancela.setCnpj("XXX");
    cancela.setMotivo("Motivo do cancelamento");
    cancela.setDataEvento(LocalDateTime.of(2024, 6, 13, 15, 4, 50));

    TEnvEventoCancelamento enviEvento = CancelamentoUtil.montaCancelamento(cancela, config);
    String proc = CancelamentoUtil.criaProcEventoCancelamento(config, enviEvento, retCance);
}
```
