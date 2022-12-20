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
    .get("/repos/rodrigocananea/java-boletos/releases")
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
