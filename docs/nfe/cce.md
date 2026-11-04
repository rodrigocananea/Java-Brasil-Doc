# Carta de Correção Eletrônica

Função para gerar a Carta de Correção Eletrônica.

### Envio
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.Evento;
import br.com.swconsultoria.nfe.schemas_eventos.TEnvEventoCartaCorrecao;
import br.com.swconsultoria.nfe.schemas_eventos.TRetEnvEventoCartaCorrecao;
import br.com.swconsultoria.nfe.util.CartaCorrecaoUtil;
import br.com.swconsultoria.nfe.util.RetornoUtil;

import java.time.LocalDateTime;

/**
 * @author Samuel Oliveira
 */
public class CartaCorrecaoTeste {

    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            //O evento aceita uma lista para envio em Lote: CartaCorrecaoUtil.montaCCe(List<Evento>, config)
            Evento cce = new Evento();
            //Informe a chave da Nota a ser feita a Carta de Correção
            cce.setChave("XXX");
            //Informe o CNPJ do emitente
            cce.setCnpj("XXX");
            //Informe o Texto da Carta de Correção
            cce.setMotivo("Teste de Carta de Correção");
            //Informe a data da Carta de Correção
            cce.setDataEvento(LocalDateTime.now());
            //Informe a sequencia do Evento (cada nova CC-e da mesma nota incrementa)
            cce.setSequencia(1);

            // Monta o Evento
            TEnvEventoCartaCorrecao envEvento = CartaCorrecaoUtil.montaCCe(cce, config);

            //Envia a CCe
            TRetEnvEventoCartaCorrecao retorno = Nfe.cce(config, envEvento, true);

            //Valida o Retorno da Carta de Correção
            RetornoUtil.validaCartaCorrecao(retorno);

            //Resultado
            System.out.println();
            retorno.getRetEvento().forEach( resultado -> {
                System.out.println("# Chave: " + resultado.getInfEvento().getChNFe());
                System.out.println("# Status: " + resultado.getInfEvento().getCStat() + " - " + resultado.getInfEvento().getXMotivo());
                System.out.println("# Protocolo: " + resultado.getInfEvento().getNProt());
            });

            //Cria ProcEvento da CCe (o evento é assinado internamente)
            String proc = CartaCorrecaoUtil.criaProcEventoCCe(config, envEvento, retorno);
            System.out.println();
            System.out.println("# ProcEvento : " + proc);

        } catch (Exception e) {
            System.err.println();
            System.err.println(e.getMessage());
        }
    }
}
```

1.  Acesse o menu [Configurações (Certificado)](./configuracoes.md)

::: tip
Para imprimir a CC-e, veja [Impressão](./impressao.md#carta-de-correcao-cc-e).
:::
