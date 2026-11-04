# Migração v4.00.* → v4.1.*

::: tip Resumo rápido
Rode `pwsh scripts/migrate.ps1 -ProjectRoot . -BumpPom` (ou o equivalente bash) no seu projeto que consome a biblioteca e depois `mvn test-compile`. Os scripts estão na pasta [`scripts/`](https://github.com/Samuel-Oliveira/Java_NFe/tree/master/scripts) do repositório do Java_NFe.
:::

## O que mudou

A v4.1.* consolidou ~48 sub-packages JAXB em **2 packages**:

| Antes (v4.00.*) | Depois (v4.1.*) |
|---|---|
| `br.com.swconsultoria.nfe.schema_4.enviNFe.*` | `br.com.swconsultoria.nfe.schemas.*` |
| `br.com.swconsultoria.nfe.schema_4.consReciNFe.*` | `br.com.swconsultoria.nfe.schemas.*` |
| `br.com.swconsultoria.nfe.schema_4.consSitNFe.*` | `br.com.swconsultoria.nfe.schemas.*` |
| `br.com.swconsultoria.nfe.schema_4.consStatServ.*` | `br.com.swconsultoria.nfe.schemas.*` |
| `br.com.swconsultoria.nfe.schema_4.inutNFe.*` | `br.com.swconsultoria.nfe.schemas.*` |
| `br.com.swconsultoria.nfe.schema_4.comum.*` | `br.com.swconsultoria.nfe.schemas.*` |
| `br.com.swconsultoria.nfe.schema.consCad.*` | `br.com.swconsultoria.nfe.schemas.*` |
| `br.com.swconsultoria.nfe.schema.distDFe.*` / `resNFe.*` / `comum.*` | `br.com.swconsultoria.nfe.schemas.*` |
| `br.com.swconsultoria.nfe.schema.cce.*` / `envcce.*` | `br.com.swconsultoria.nfe.schemas_eventos.*` |
| `br.com.swconsultoria.nfe.schema.envEventoCancNFe.*` / `eventoCancNFe.*` | `br.com.swconsultoria.nfe.schemas_eventos.*` |
| `br.com.swconsultoria.nfe.schema.envEventoCancSubst.*` | `br.com.swconsultoria.nfe.schemas_eventos.*` |
| `br.com.swconsultoria.nfe.schema.envConfRecebto.*` / `confRecebto.*` | `br.com.swconsultoria.nfe.schemas_eventos.*` |
| `br.com.swconsultoria.nfe.schema.envEpec.*` | `br.com.swconsultoria.nfe.schemas_eventos.*` |
| `br.com.swconsultoria.nfe.schema.eventoGenerico.*` | `br.com.swconsultoria.nfe.schemas_eventos.*` |
| `br.com.swconsultoria.nfe.schema.envEventoAtorInteressado.*` | `br.com.swconsultoria.nfe.schemas_eventos.*` |
| `br.com.swconsultoria.nfe.schema.envEventoEConf.*` / `envEventoCancEConf.*` | `br.com.swconsultoria.nfe.schemas_eventos.*` |
| `br.com.swconsultoria.nfe.schema.envEventoInsucessoNFe.*` / `envEventoCancInsucessoNFe.*` | `br.com.swconsultoria.nfe.schemas_eventos.*` |
| `br.com.swconsultoria.nfe.schema.envEventoEntregaNFe.*` / `envEventoCancEntregaNFe.*` | `br.com.swconsultoria.nfe.schemas_eventos.*` |

## Classes renomeadas em `schemas_eventos`

Como todos os eventos agora vivem no mesmo package, os nomes genéricos foram renomeados por evento:

| Classe v4.00.* | Classe v4.1.* | Evento |
|---|---|---|
| `TEnvEvento` / `TRetEnvEvento` (CancNFe) | `TEnvEventoCancelamento` / `TRetEnvEventoCancelamento` | Cancelamento |
| `TEnvEvento` / `TRetEnvEvento` (envcce) | `TEnvEventoCartaCorrecao` / `TRetEnvEventoCartaCorrecao` | Carta de Correção |
| `TEnvEvento` / `TRetEnvEvento` (envEpec) | `TEnvEventoEpec` / `TRetEnvEventoEpec` | EPEC |
| `TEnvEvento` / `TRetEnvEvento` (envConfRecebto) | `TEnvEventoManifestacao` / `TRetEnvEventoManifestacao` | Manifestação Destinatário |
| `TEnvEvento` / `TRetEnvEvento` (CancSubst) | `TEnvEventoCancelamentoSubstituicao` / `TRetEnvEventoCancelamentoSubstituicao` | Cancelamento por Substituição |
| `TEnvEvento` / `TRetEnvEvento` (AtorInteressado) | `TEnvEventoAtorInteressado` / `TRetEnvEventoAtorInteressado` | Ator Interessado |
| `TEnvEvento` / `TRetEnvEvento` (EConf) | `TEnvEventoConciliacaoFinanceira` / `TRetEnvEventoConciliacaoFinanceira` | ECONF |
| `TEnvEvento` / `TRetEnvEvento` (CancEConf) | `TEnvEventoCancelamentoConciliacaoFinanceira` / `TRetEnvEventoCancelamentoConciliacaoFinanceira` | Cancelamento ECONF |
| `TEnvEvento` / `TRetEnvEvento` (InsucessoNFe) | `TEnvEventoInsucessoEntrega` / `TRetEnvEventoInsucessoEntrega` | Insucesso de Entrega |
| `TEnvEvento` / `TRetEnvEvento` (CancInsucessoNFe) | `TEnvEventoCancelamentoInsucessoEntrega` / `TRetEnvEventoCancelamentoInsucessoEntrega` | Canc. Insucesso de Entrega |
| `TEnvEvento` / `TRetEnvEvento` (EntregaNFe) | `TEnvEventoComprovanteEntrega` / `TRetEnvEventoComprovanteEntrega` | Comprovante de Entrega |
| `TEnvEvento` / `TRetEnvEvento` (CancEntregaNFe) | `TEnvEventoCancelamentoComprovanteEntrega` / `TRetEnvEventoCancelamentoComprovanteEntrega` | Canc. Comprovante de Entrega |

As classes internas (`TEvento.InfEvento`, `TRetEnvEvento.RetEvento`, etc.) seguem o mesmo padrão: o prefixo do nome externo muda.

## Outras classes que mudaram de nome

| Antes (v4.00.*) | Depois (v4.1.*) | Motivo |
|---|---|---|
| `schema.resevento.ResEvento` | `schemas_eventos.ResumoEvento` | Nome normalizado |
| `schema_4.consSitNFe.TProcEvento` | `schemas.TProcEventoConsSitNFe` | Conflito com `TProcEvento*` de `schemas_eventos` |
| `schema.envcce.TretEvento` | `schemas_eventos.TRetEventoCartaCorrecao` | Padronização de capitalização + sufixo |
| `schema.envConfRecebto.TretEvento` | `schemas_eventos.TRetEventoManifestacao` | idem |

## Eventos da Reforma Tributária

Cada XSD de evento (`e110001`, `e112110-150`, `e211110-150`, `e212110-120`, `e412120-130`, `e210200-240`, `110150`...) gera uma classe `DetEvento<código>` top-level em `schemas_eventos`:

| Antes | Depois |
|---|---|
| `schema.evento110001.DetEvento` | `schemas_eventos.DetEvento110001` |
| `schema.evento112110.DetEvento` | `schemas_eventos.DetEvento112110` |
| `schema.evento112110.DetEvento.GConsumo` | `schemas_eventos.DetEvento112110.GConsumo` |
| `schema.evento211110.DetEvento.GCredPres` | `schemas_eventos.DetEvento211110.GCredPres` |

## Como migrar automaticamente

Faça backup (commit ou branch) antes.

**PowerShell (Windows / Linux / macOS — recomendado):**
```powershell
# Simulação (sem alterar arquivos):
pwsh scripts/migrate.ps1 -ProjectRoot . -DryRun

# Aplicar nas fontes + atualizar <java-nfe.version> no pom.xml:
pwsh scripts/migrate.ps1 -ProjectRoot . -BumpPom

# Se a sua versão atual não é a 4.00.51:
pwsh scripts/migrate.ps1 -ProjectRoot . -OldVersion 4.00.49 -BumpPom
```

**Bash (alternativa, mais limitada):**
```bash
bash scripts/migrate.sh src/main/java --dry-run
bash scripts/migrate.sh src/main/java
bash scripts/migrate.sh src/test/java
```

O `migrate.sh` não atualiza o pom, não renomeia o nome simples no corpo do arquivo (`TEnvEvento` → `TEnvEventoCancelamento`) e não trata os eventos individuais por código. Para projetos grandes, prefira o `migrate.ps1`.

## ⚠️ Breaking changes de API

| API | Antes | Depois | O que fazer |
|---|---|---|---|
| `TProtNFe.InfProt.getDhRecbto()` | `XMLGregorianCalendar` | **`String`** (ISO 8601 com offset, ex. `"2024-01-15T10:30:00-03:00"`) | Para `LocalDateTime`: `OffsetDateTime.parse(valor).atZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime()` |
| `TTribNFCe.getGIBSCBSMono()` / `setGIBSCBSMono()` (v4.3.0) | existia | **removido** pelo PL 010g | Ajuste a montagem de NFC-e com monofasia |

## O que o script NÃO faz

1. **Imports wildcard** (`import ...schema_4.*;`): o prefixo é trocado, mas pode surgir ambiguidade; resolva os imports individualmente.
2. **`TUf` em `schemas_eventos`**: existe um `TUf` para eventos e outro em `schemas` para a NF-e. Confira de qual package vem o import.
3. **Reflection / `Class.forName(...)`**: strings com o nome completo das classes precisam ser atualizadas à mão.
4. **APIs que mudaram de tipo**: veja a tabela acima.

## Verificação pós-migração

```bash
mvn test-compile
mvn test
```

Erros `cannot find symbol` indicam exatamente qual classe/método precisa de ajuste manual. O guia original está em [MIGRATION.md](https://github.com/Samuel-Oliveira/Java_NFe/blob/master/MIGRATION.md).
