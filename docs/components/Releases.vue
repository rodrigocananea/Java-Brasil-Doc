<template>
  <div v-for="release in releases">
    <h2>{{ release.tag_name }} - {{ formatarData(release.published_at) }}</h2>
    <div v-html="converter.makeHtml(release.body)"></div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import showdown from 'showdown'
import axios from "axios";

const converter = new showdown.Converter();

const http = axios.create({
  baseURL: "https://api.github.com",
  timeout: 1000,
  headers: {
    Accept: "application/vnd.github+json",
    Authorization:
      "Bearer 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",
  },
});

let releases = ref();

onBeforeMount(() => {
  http
    .get("/repos/Java-Brasil/Java-Boletos/releases")
    .then((res) => {
      releases.value = res.data;
    })
    .catch((err) => console.log(err));
});

function formatarData(data) {
  const options = {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const date = new Date(data);
  return new Intl.DateTimeFormat("pt-BR", options).format(date);
}
</script>
