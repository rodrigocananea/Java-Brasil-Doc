# Conciliação Financeira (ECONF)

Evento de Conciliação Financeira (NT 2024.002, `tpEvento = 110750`): informa os meios de pagamento efetivamente utilizados na operação.

### Envio
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.enuns.DocumentoEnum;
import br.com.swconsultoria.nfe.exception.NfeException;
import br.com.swconsultoria.nfe.schemas_eventos.DetEventoConciliacaoFinanceira;
import br.com.swconsultoria.nfe.schemas_eventos.TEnvEventoConciliacaoFinanceira;
import br.com.swconsultoria.nfe.schemas_eventos.TEventoConciliacaoFinanceira;
import br.com.swconsultoria.nfe.schemas_eventos.TRetEnvEventoConciliacaoFinanceira;
import br.com.swconsultoria.nfe.schemas_eventos.TUfEmi;
import br.com.swconsultoria.nfe.util.XmlNfeUtil;

import java.time.LocalDateTime;

/**
 * @author Samuel Oliveira
 */
public class EConfTeste {

    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            String chave = "XXX";
            String cnpj = "XXX";
            int sequencia = 1;

            // Monta o Evento
            TEnvEventoConciliacaoFinanceira envEvento = new TEnvEventoConciliacaoFinanceira();
            envEvento.setVersao("1.00");
            envEvento.setIdLote("1");

            TEventoConciliacaoFinanceira evento = new TEventoConciliacaoFinanceira();
            evento.setVersao("1.00");

            TEventoConciliacaoFinanceira.InfEvento infEvento = new TEventoConciliacaoFinanceira.InfEvento();
            infEvento.setId("ID" + "110750" + chave + String.format("%02d", sequencia));
            infEvento.setCOrgao(config.getEstado().getCodigoUF());
            infEvento.setTpAmb(config.getAmbiente().getCodigo());
            infEvento.setCNPJ(cnpj);
            infEvento.setChNFe(chave);
            infEvento.setDhEvento(XmlNfeUtil.dataNfe(LocalDateTime.now(), config.getZoneId()));
            infEvento.setTpEvento("110750");
            infEvento.setNSeqEvento(String.valueOf(sequencia));
            infEvento.setVerEvento("1.00");

            DetEventoConciliacaoFinanceira detEvento = new DetEventoConciliacaoFinanceira();
            detEvento.setVersao("1.00");
            detEvento.setDescEvento("ECONF");
            detEvento.setVerAplic("1.00");

            // Um detPag para cada pagamento
            DetEventoConciliacaoFinanceira.DetPag detPag = new DetEventoConciliacaoFinanceira.DetPag();
            detPag.setIndPag("1");          // 0 = à vista, 1 = a prazo
            detPag.setTPag("04");           // 04 = Cartão de Débito
            detPag.setVPag("500.00");
            detPag.setDPag("2025-11-04");   // data do pagamento
            detPag.setCNPJPag("XXX");       // CNPJ do recebedor do pagamento
            detPag.setUFPag(TUfEmi.GO);
            detPag.setTBand("02");          // bandeira
            detPag.setCNPJIF("XXX");        // CNPJ da instituição de pagamento
            detPag.setCAut("XXXXXX");       // código de autorização
            detEvento.getDetPag().add(detPag);

            infEvento.setDetEvento(detEvento);
            evento.setInfEvento(infEvento);
            envEvento.getEvento().add(evento);

            //Envia a ECONF
            TRetEnvEventoConciliacaoFinanceira retorno = Nfe.econf(config, envEvento, DocumentoEnum.NFE, true);

            if (!retorno.getCStat().equals("128")) {
                throw new NfeException(retorno.getCStat() + " - " + retorno.getXMotivo());
            }
            if (!retorno.getRetEvento().get(0).getInfEvento().getCStat().equals("135")) {
                throw new NfeException(retorno.getRetEvento().get(0).getInfEvento().getCStat() + " - "
                        + retorno.getRetEvento().get(0).getInfEvento().getXMotivo());
            }

            //Resultado
            retorno.getRetEvento().forEach(resultado -> {
                System.out.println("# Chave: " + resultado.getInfEvento().getChNFe());
                System.out.println("# Status: " + resultado.getInfEvento().getCStat() + " - " + resultado.getInfEvento().getXMotivo());
                System.out.println("# Protocolo: " + resultado.getInfEvento().getNProt());
            });

        } catch (Exception e) {
            System.err.println();
            System.err.println(e.getMessage());
        }
    }
}
```

1.  Acesse o menu [Configurações (Certificado)](./configuracoes.md)

### Cancelamento da ECONF

Monte um `TEnvEventoCancelamentoConciliacaoFinanceira` (evento `110751`) de forma análoga e envie com:

```java
TRetEnvEventoCancelamentoConciliacaoFinanceira retorno = Nfe.cancelamentoEconf(config, envEvento, true);
```
