# Cancelamento

Função para Cancelar a NFe/NFCe.

### Cancelar NFe/NFCe
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.Evento;
import br.com.swconsultoria.nfe.dom.enuns.DocumentoEnum;
import br.com.swconsultoria.nfe.schemas_eventos.TEnvEventoCancelamento;
import br.com.swconsultoria.nfe.schemas_eventos.TRetEnvEventoCancelamento;
import br.com.swconsultoria.nfe.util.CancelamentoUtil;
import br.com.swconsultoria.nfe.util.RetornoUtil;

import java.time.LocalDateTime;

/**
 * @author Samuel Oliveira
 */
public class CancelarTeste {

    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            //O evento aceita uma lista de cancelamentos para envio em Lote.
            Evento cancela = new Evento();
            //Informe a chave da Nota a ser Cancelada
            cancela.setChave("XXX");
            //Informe o protocolo da Nota a ser Cancelada
            cancela.setProtocolo("XXX");
            //Informe o CNPJ do emitente
            cancela.setCnpj("XXX");
            //Informe o Motivo do Cancelamento
            cancela.setMotivo("Teste de Cancelamento");
            //Informe a data do Cancelamento
            cancela.setDataEvento(LocalDateTime.now());

            //Monta o Evento de Cancelamento
            TEnvEventoCancelamento enviEvento = CancelamentoUtil.montaCancelamento(cancela, config);

            //Envia o Evento de Cancelamento (DocumentoEnum.NFE ou DocumentoEnum.NFCE)
            TRetEnvEventoCancelamento retorno = Nfe.cancelarNfe(config, enviEvento, true, DocumentoEnum.NFE);

            //Valida o Retorno do Cancelamento
            RetornoUtil.validaCancelamento(retorno);

            //Resultado
            System.out.println();
            retorno.getRetEvento().forEach( resultado -> {
                System.out.println("# Chave: " + resultado.getInfEvento().getChNFe());
                System.out.println("# Status: " + resultado.getInfEvento().getCStat() + " - " + resultado.getInfEvento().getXMotivo());
                System.out.println("# Protocolo: " + resultado.getInfEvento().getNProt());
            });

            //Cria ProcEvento de Cancelamento
            String proc = CancelamentoUtil.criaProcEventoCancelamento(config, enviEvento, retorno.getRetEvento().get(0));
            System.out.println();
            System.out.println("# ProcEvento : " + proc);

        } catch (Exception e) {
            System.err.println();
            System.err.println("# Erro: " + e.getMessage());
        }
    }
}
```

1.  Acesse o menu [Configurações (Certificado)](./configuracoes.md)

::: tip
Precisa do `procEventoNFe` de uma nota que já foi cancelada? Veja [Consulta Situação](./consulta-situacao.md#recuperar-o-procevento-de-uma-nota-cancelada).
:::

### Cancelamento por Substituição (NFC-e)
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.Evento;
import br.com.swconsultoria.nfe.schemas_eventos.TEnvEventoCancelamentoSubstituicao;
import br.com.swconsultoria.nfe.schemas_eventos.TRetEnvEventoCancelamentoSubstituicao;
import br.com.swconsultoria.nfe.util.CancelamentoSubstituicaoUtil;
import br.com.swconsultoria.nfe.util.RetornoUtil;

import java.time.LocalDateTime;

/**
 * @author Samuel Oliveira
 */
public class CancelarSubstituicaoTeste {

    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            Evento cancela = new Evento();
            //Informe a chave da Nota a ser Cancelada
            cancela.setChave("XXX");
            //Informe a chave da Nota Substituta
            cancela.setChaveSusbstituta("XXX");
            //Informe o protocolo da Nota a ser Cancelada
            cancela.setProtocolo("XXX");
            //Informe o CNPJ do emitente
            cancela.setCnpj("XXX");
            //Informe o Motivo do Cancelamento
            cancela.setMotivo("Teste de Cancelamento");
            //Informe a data do Cancelamento
            cancela.setDataEvento(LocalDateTime.now());

            //Monta o Evento de Cancelamento
            TEnvEventoCancelamentoSubstituicao enviEvento = CancelamentoSubstituicaoUtil.montaCancelamento(cancela, config);

            //Envia o Evento de Cancelamento
            TRetEnvEventoCancelamentoSubstituicao retorno = Nfe.cancelarSubstituicaoNfe(config, enviEvento, true);

            //Valida o Retorno do Cancelamento
            RetornoUtil.validaCancelamentoSubstituicao(retorno);

            //Resultado
            System.out.println();
            retorno.getRetEvento().forEach( resultado -> {
                System.out.println("# Chave: " + resultado.getInfEvento().getChNFe());
                System.out.println("# Status: " + resultado.getInfEvento().getCStat() + " - " + resultado.getInfEvento().getXMotivo());
                System.out.println("# Protocolo: " + resultado.getInfEvento().getNProt());
            });

            //Cria ProcEvento de Cancelamento
            String proc = CancelamentoSubstituicaoUtil.criaProcEventoCancelamento(config, enviEvento, retorno.getRetEvento().get(0));
            System.out.println();
            System.out.println("# ProcEvento : " + proc);

        } catch (Exception e) {
            System.err.println();
            System.err.println("# Erro: " + e.getMessage());
        }
    }
}
```

1.  Acesse o menu [Configurações (Certificado)](./configuracoes.md)
