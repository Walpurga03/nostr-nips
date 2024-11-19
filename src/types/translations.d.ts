declare module '*/translation.json' {
  interface TranslationSchema {
    nav: {
      home: string;
      keyGenerator: string;
      messenger: string;
      nip1: string;
      nip2: string;
      toggleMenu: string;
      switchLanguage: string;
    };
    home: {
      welcome: string;
      nostr_intro: string;
      protocol_basics: string;
      protocol_basics_intro: string;
      event_structure: {
        title: string;
        id_desc: string;
        pubkey_desc: string;
        created_at_desc: string;
        kind_desc: string;
        tags_desc: string;
        content_desc: string;
        sig_desc: string;
      };
      summary: {
        title: string;
        text: string;
        info_box: string;
      };
    };
    nip1: {
      nip1_title: string;
      key_protocol: string;
      key_protocol_description: string;
      sections: {
        [key: string]: {
          title: string;
          content: string;
        };
      };
    };
    nip2: {
      nip2_title: string;
      description: string;
      details: string;
    };
    keyGenerator: {
      pageTitle: string;
      pageSubtitle: string;
      sections: {
        intro: {
          title: string;
          content: string;
        };
        privateKey: {
          title: string;
          content: string;
        };
        publicKey: {
          title: string;
          content: string;
        };
        generator: {
          title: string;
          button: string;
          privateKeyLabel: string;
          publicKeyLabel: string;
          copyButton: string;
          copied: string;
          downloadButton: string;
          warning: string;
        };
      };
      errors: {
        generateFailed: string;
        copyFailed: string;
      };
    };
  }

  const value: TranslationSchema;
  export default value;
}
