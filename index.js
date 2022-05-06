import { ref, computed, reactive, onMounted } from "vue";

function useNeo(nodeName = "") {
  if (!nodeName)
    throw new Error("The name of a node or Label is required in Neo4j!");

  const records = ref([]);
  const loading = ref(false);
  const error = ref("");

  return {
    records,
    loading,
    error,
  };
}

// Factory
export const create = (nodeName = "") => {
  const instance = useNeo(nodeName);
  return {
    ...instance,
    [nodeName]: instance,
  };
};

export const useMovies = create("Movie");
export const useActors = create("Actor");

console.log("useMovies", useMovies);
console.log("useActors", useActors);
