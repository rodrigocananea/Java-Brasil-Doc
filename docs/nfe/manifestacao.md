# Manifestação

Função para manifestar a NF-e recebida na Sefaz (Manifestação do Destinatário).

### Enviar evento de Manifestação
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.Evento;
import br.com.swconsultoria.nfe.dom.enuns.ManifestacaoEnum;
import br.com.swconsultoria.nfe.schemas_eventos.TEnvEventoManifestacao;
import br.com.swconsultoria.nfe.schemas_eventos.TRetEnvEventoManifestacao;
import br.com.swconsultoria.nfe.util.ManifestacaoUtil;
import br.com.swconsultoria.nfe.util.RetornoUtil;

import java.time.LocalDateTime;

/**
 * @author Samuel Oliveira
 */
public class ManifestacaoTeste {
    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            //O evento aceita uma lista de Manifestações para envio em Lote.
            Evento manifesta = new Evento();
            //Informe a chave da Nota a ser Manifestada
            manifesta.setChave("XXX");
            //Informe o CNPJ do destinatário (o mesmo do certificado)
            manifesta.setCnpj("XXX");
            //Caso o Tipo de manifestação seja OPERACAO_NAO_REALIZADA, informe o Motivo
            //manifesta.setMotivo("Teste Operação Não Realizada");
            //Informe a data da Manifestação
            manifesta.setDataEvento(LocalDateTime.now());
            //Informe o Tipo da Manifestação (2)
            manifesta.setTipoManifestacao(ManifestacaoEnum.CIENCIA_DA_OPERACAO);

            //Monta o Evento de Manifestação
            TEnvEventoManifestacao enviEvento = ManifestacaoUtil.montaManifestacao(manifesta, config);

            //Envia o Evento de Manifestação
            TRetEnvEventoManifestacao retorno = Nfe.manifestacao(config, enviEvento, true);

            //Valida o Retorno da Manifestação
            RetornoUtil.validaManifestacao(retorno);

            //Resultado
            System.out.println();
            retorno.getRetEvento().forEach( resultado -> {
                System.out.println("# Chave: " + resultado.getInfEvento().getChNFe());
                System.out.println("# Status: " + resultado.getInfEvento().getCStat() + " - " + resultado.getInfEvento().getXMotivo());
                System.out.println("# Protocolo: " + resultado.getInfEvento().getNProt());
            });

            //Cria ProcEvento de Manifestação
            String proc = ManifestacaoUtil.criaProcEventoManifestacao(config, enviEvento, retorno.getRetEvento().get(0));
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
2.  Valores de `ManifestacaoEnum`: `CIENCIA_DA_OPERACAO`, `CONFIRMACAO_DA_OPERACAO`, `DESCONHECIMENTO_DA_OPERACAO`, `OPERACAO_NAO_REALIZADA`.

::: tip
Após a Ciência da Operação, o XML completo fica disponível via [Distribuição DF-e](./baixar-documento.md).
:::
