export default {
  title: "Java Brasil",
  description: "An awesome docs template built by me",

  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "Java Brasil",
    // Navbar Link
    nav: [
      { text: "Sobre", link: "/about" },
      {
        // Dropdown Menu
        text: "Documentações",
        items: [
          { text: "Java-Certificado", link: "/certificado/index" },
          { text: "Java-NFe", link: "/nfe/index" },
          { text: "Java-CTe", link: "/cte/index" },
          { text: "Java-Boletos", link: "/boletos/index" },
          { text: "Java-eSocial", link: "https://github.com/Samuel-Oliveira/Java-eSocial" },
        ],
      },
    ],
    // Social Icons
    socialLinks: [
      { icon: "github", link: "github.com/evavic44" },
      { icon: "discord", link: "https://discord.gg/ZXpqnaV" },
      {
        icon: "youtube",
        link: "https://www.youtube.com/user/0SaMs/streams",
      },
    ],
    // Sidebar
    sidebar: {
      '/danfe/': [
        {
          text: 'Inicio',
          items: [
            { text: 'Pagina Inicial', link: '/danfe/index' },
          ]
        },
        {
          text: 'Configuração',
          items: [
            { text: 'Certificado A1', link: '/danfe/certificado-a1' },
            { text: 'Certificado A3', link: '/danfe/certificado-a3' },
            { text: 'Certificado Por CNPJ/CPF', link: '/danfe/certificado-por-cnpjcpf' },
            { text: 'Repositórios', link: '/danfe/repositorios' }
          ]
        },
      ],

      '/certificado/': [
        {
          text: 'Inicio',
          items: [
            { text: 'Pagina Inicial', link: '/certificado/index' },
          ]
        },
        {
          text: 'Configuração',
          items: [
            { text: 'Certificado A1', link: '/certificado/certificado-a1' },
            { text: 'Certificado A3', link: '/certificado/certificado-a3' },
            { text: 'Certificado Por CNPJ/CPF', link: '/certificado/certificado-por-cnpjcpf' },
            { text: 'Repositórios', link: '/certificado/repositorios' }
          ]
        },
      ],

      '/nfe/': [
        {
          text: 'Inicio',
          items: [
            { text: 'Pagina Inicial', link: '/nfe/index' },
          ]
        },
        {
          text: 'Configuração',
          items: [
            { text: 'Certificado', link: '/nfe/configuracoes' },
          ]
        },
        {
          text: 'NFe',
          items: [
            { text: 'Status Serviço Sefaz', link: '/nfe/status-servico' },
            { text: 'Consulta Situação', link: '/nfe/consulta-situacao' },
            { text: 'Envio', link: '/nfe/envio' },
            { text: 'Cancelamento', link: '/nfe/cancelamento' },
            { text: 'Carta de Correção Eletrônica', link: '/nfe/cce' },
            { text: 'Inutilização', link: '/nfe/inutilizacao' },
            { text: 'Manifestação', link: '/nfe/manifestacao' },
            { text: 'Baixar Documento (DistDfe)', link: '/nfe/baixar-documento' },
            { text: 'Consulta Cadastro', link: '/nfe/consulta-cadastro' },
            { text: 'Envio Epec', link: '/nfe/envio-epec' },
          ]
        },
      ],

      '/cte/': [
        {
          text: 'Inicio',
          items: [
            { text: 'Pagina Inicial', link: '/cte/index' },
          ]
        },
        {
          text: 'Configuração',
          items: [
            { text: 'Certificado', link: '/cte/configuracoes' },
          ]
        },
        {
          text: 'CTe',
          items: [
            { text: 'Status Serviço Sefaz', link: '/cte/status-servico' },
            { text: 'Consulta Situação', link: '/cte/consulta-situacao' },
            { text: 'Envio', link: '/cte/envio' },
            { text: 'Cancelamento', link: '/cte/cancelamento' },
            { text: 'Inutilização', link: '/cte/inutilizacao' },
            { text: 'Carta de Correção Eletrônica', link: '/cte/carta-correcao' },
            { text: 'Baixar Documento', link: '/cte/baixar-documento' },
          ]
        },
      ],

      '/boletos/': [
        {
          text: 'Inicio',
          items: [
            { text: 'Pagina Inicial', link: '/boletos/index' },
            { text: 'Configuração básica', link: '/boletos/configuracoes' },
          ]
        },

        {
          text: 'Banco do Brasil',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Configuração', link: '/boletos/banco-do-brasil/configuracoes' },
            { text: 'Preenchimento', link: '/boletos/banco-do-brasil/preenchimento' },
            { text: 'API', link: '/boletos/banco-do-brasil/api' },
            { text: 'CNAB', link: '/boletos/banco-do-brasil/cnab' },
          ]
        },

        {
          text: 'Banrisul',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Configuração', link: '/boletos/banrisul/configuracoes' },
            { text: 'Preenchimento', link: '/boletos/banrisul/preenchimento' },
            { text: 'API', link: '/boletos/banrisul/api' },
            { text: 'CNAB', link: '/boletos/banrisul/cnab' },
          ]
        },

        {
          text: 'Bradesco',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Configuração', link: '/boletos/bradesco/configuracoes' },
            { text: 'Preenchimento', link: '/boletos/bradesco/preenchimento' },
            { text: 'API', link: '/boletos/bradesco/api' },
            { text: 'CNAB', link: '/boletos/bradesco/cnab' },
          ]
        },

        {
          text: 'Itaú',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Configuração', link: '/boletos/itau/configuracoes' },
            { text: 'Preenchimento', link: '/boletos/itau/preenchimento' },
            { text: 'API', link: '/boletos/itau/api' },
          ]
        },

        {
          text: 'Safe2Pay',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Configuração', link: '/boletos/safe2pay/configuracoes' },
            { text: 'Preenchimento', link: '/boletos/safe2pay/preenchimento' },
            { text: 'API', link: '/boletos/safe2pay/api' },
          ]
        },

        // {
        //   text: 'Exemplo',
        //   collapsible: true,
        //   collapsed: true,
        //   items: [
        //     { text: 'Teste', link: '/boletos/banrisul/teste' },
        //   ]
        // },
      ],

    },
    footer: {
      message: "MIT License.",
      copyright: "Copyright © 2022 Java Brasil",
    },
    markdown: {
      theme: "material-palenight",
      lineNumbers: true,
    },
  },
};
