# Java DANFe

***Biblioteca para impressão de Documentos Fiscais***

## Dúvidas, Sugestões ou Consultoria
[![Java Brasil](https://discordapp.com/api/guilds/519583346066587676/widget.png?style=banner2)](https://discord.gg/ZXpqnaV)

## Gostou do Projeto? Dê sua colaboração pelo Pix: 01713390108
<p align="center">
    <img src="https://swconsultoria.com.br/pix.png" width="220">
</p>

::: tip Usa o Java-NFe?
Desde a v4.00.41 o **Java-NFe já traz a impressão de NF-e, NFC-e e CC-e** (`ImpressaoNfeUtil`) e, a partir da v4.3.0, o **DANFE v2 da Reforma Tributária** (NT 2026.010). Veja [Java-NFe → Impressão](/nfe/impressao).
:::

Para Iniciar :
- Caso use Libs baixe o [java-danfe-1.8.jar](https://github.com/Samuel-Oliveira/Java_Danfe/raw/master/java-danfe-1.6.jar) e o adicione às bibliotecas de Seu Projeto.

- Maven :
```xml
<dependency>
    <groupId>br.com.swconsultoria</groupId>
    <artifactId>java-danfe</artifactId>
    <version>1.8</version>
</dependency>
```

- Gradle :
```groovy
repositories {
    maven {
        url = "https://oss.sonatype.org/content/repositories/snapshots"
    }
}
dependencies {
    implementation "br.com.swconsultoria:java-danfe:1.8"
}
```

