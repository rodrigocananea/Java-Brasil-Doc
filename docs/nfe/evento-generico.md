# Eventos da Reforma Tributária (Evento Genérico)

Os eventos criados pela Reforma Tributária são enviados por uma API única: você monta o `detEvento` específico do evento (classe `DetEvento<código>` do package `schemas_eventos`) e o `EventoGenericoUtil` monta, assina e envia o envelope.

### Exemplo: 112110 - Pagamento integral para liberar crédito presumido
```java
import br.com.swconsultoria.nfe.Nfe;
import br.com.swconsultoria.nfe.dom.ConfiguracoesNfe;
import br.com.swconsultoria.nfe.dom.Evento;
import br.com.swconsultoria.nfe.dom.enuns.EventosEnum;
import br.com.swconsultoria.nfe.schemas_eventos.DetEvento112110;
import br.com.swconsultoria.nfe.schemas_eventos.TEnvEventoGenerico;
import br.com.swconsultoria.nfe.schemas_eventos.TRetEnvEventoGenerico;
import br.com.swconsultoria.nfe.util.ConstantesUtil;
import br.com.swconsultoria.nfe.util.EventoGenericoUtil;
import br.com.swconsultoria.nfe.util.RetornoUtil;

import java.time.LocalDateTime;

/**
 * @author Samuel Oliveira
 */
public class EventoGenericoTeste {

    public static void main(String[] args) {
        try {
            // Inicia As Configurações (1)
            ConfiguracoesNfe config = Config.iniciaConfiguracoes();

            //Dados básicos do Evento
            Evento generico = new Evento();
            generico.setChave("XXX");
            generico.setCnpj("XXX");            // ou setCpf
            generico.setSequencia(1);
            generico.setDataEvento(LocalDateTime.now());

            //Payload específico do evento (2)
            DetEvento112110 detEvento = new DetEvento112110();
            detEvento.setVersao(ConstantesUtil.VERSAO.EVENTO_GENERICO);
            detEvento.setDescEvento("Informação de efetivo pagamento integral para liberar crédito presumido do adquirente");
            detEvento.setCOrgaoAutor(config.getEstado().getCodigoUF());
            detEvento.setTpAutor("1");
            detEvento.setVerAplic("1.0");
            detEvento.setIndQuitacao("1");
            generico.setDetEvento(detEvento);

            //Monta o Evento Genérico: informe a classe do detEvento e o tipo do evento
            TEnvEventoGenerico enviEvento = EventoGenericoUtil.montaEvento(generico, DetEvento112110.class,
                    EventosEnum.PAGAMENTO_INTEGRAL_CREDITO_PRESUMIDO, config);

            //Envia o Evento Genérico
            TRetEnvEventoGenerico retorno = Nfe.eventoGenerico(config, enviEvento, true);

            //Valida o Retorno
            RetornoUtil.validaEventoGenerico(retorno);

            //Resultado
            System.out.println();
            retorno.getRetEvento().forEach( resultado -> {
                System.out.println("# Chave: " + resultado.getInfEvento().getChNFe());
                System.out.println("# Status: " + resultado.getInfEvento().getCStat() + " - " + resultado.getInfEvento().getXMotivo());
                System.out.println("# Protocolo: " + resultado.getInfEvento().getNProt());
            });

            //Cria ProcEvento Genérico
            String proc = EventoGenericoUtil.criaProcEventoGenerico(config, enviEvento, retorno.getRetEvento().get(0));
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
2.  O payload **precisa ser o do próprio `tpEvento`**: usar a classe de outro evento gera a rejeição `493 - Evento não atende o Schema XML específico`.

### Eventos disponíveis (`EventosEnum`)

| Código | `EventosEnum` | Classe do detEvento |
|---|---|---|
| 112110 | `PAGAMENTO_INTEGRAL_CREDITO_PRESUMIDO` | `DetEvento112110` |
| 112120 | `IMPORTACAO_ALC_ZFM_NAO_CONVERTIDA` | `DetEvento112120` |
| 112130 | `PERECIMENTO_TRANSPORTE_FORNECEDOR` | `DetEvento112130` |
| 112140 | `FORNECIMENTO_NAO_REALIZADO_PAGAMENTO_ANTECIPADO` | `DetEvento112140` |
| 112150 | `ATUALIZACAO_DATA_PREVISAO_ENTREGA` | `DetEvento112150` |
| 211110 | `APROPRIACAO_CREDITO_PRESUMIDO` | `DetEvento211110` |
| 211120 | `DESTINACAO_CONSUMO_PESSOAL` | `DetEvento211120` |
| 211124 | `PERECIMENTO_TRANSPORTE_ADQUIRENTE` | `DetEvento211124` |
| 211128 | `ACEITE_DEBITO_NOTA_CREDITO` | `DetEvento211128` |
| 211130 | `IMOBILIZACAO_ITEM` | `DetEvento211130` |
| 211140 | `APROPRIACAO_CREDITO_COMBUSTIVEL` | `DetEvento211140` |
| 211150 | `APROPRIACAO_CREDITO_BENS_SERVICOS` | `DetEvento211150` |
| 212110 | `MANIFESTACAO_TRANSFERENCIA_CREDITO_IBS` | `DetEvento212110` |
| 212120 | `MANIFESTACAO_TRANSFERENCIA_CREDITO_CBS` | `DetEvento212120` |
| 412120 | `MANIFESTACAO_FISCO_TRANSFERENCIA_IBS` | `DetEvento412120` |
| 412130 | `MANIFESTACAO_FISCO_TRANSFERENCIA_CBS` | `DetEvento412130` |
| 110001 | `CANCELAMENTO_EVENTO` | `DetEvento110001` |

::: info Evento 110300 (Vinculação de Pagamento)
O PL 010g (v4.3.0) trouxe as classes `DetEvento110300` e `TEventoPgto` (NT 2026.006), mas o código `110300` ainda não consta no `EventosEnum`, portanto ainda não pode ser enviado por `EventoGenericoUtil.montaEvento`.
:::

### Outros eventos com método próprio em `Nfe`

| Evento | Método | Classes |
|---|---|---|
| Ator Interessado | `Nfe.atorInteressadoNFe(config, envEvento, valida)` | `TEnvEventoAtorInteressado` |
| Insucesso de Entrega (NT 2023.005) | `Nfe.insucessoEntrega(config, envEvento, valida)` | `TEnvEventoInsucessoEntrega` |
| Cancelamento de Insucesso de Entrega | `Nfe.cancelamentoInsucessoEntrega(config, envEvento, valida)` | `TEnvEventoCancelamentoInsucessoEntrega` |
| Conciliação Financeira (ECONF) | `Nfe.econf(config, envEvento, documento, valida)` | ver [ECONF](./econf.md) |
| Cancelamento de ECONF | `Nfe.cancelamentoEconf(config, envEvento, valida)` | `TEnvEventoCancelamentoConciliacaoFinanceira` |
| Evento manual (XML pronto) | `Nfe.enviarEnventoManual(config, xml, ServicosEnum, valida, assina, DocumentoEnum)` | String |

Para esses eventos o `TEnvEvento*` é montado manualmente (como no exemplo do [ECONF](./econf.md)).
