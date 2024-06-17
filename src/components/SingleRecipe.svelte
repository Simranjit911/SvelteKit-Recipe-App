<script lang="ts">
    export let recipe;
  
    function truncateText(text, wordLimit) {
    const words = text.split("");

    if (words.length > wordLimit) {
      let res = words.slice(0, wordLimit).join("") + "...";

      return res;
    }
    return text;
  }

  function capitalizeText(text) {
    return text.toUpperCase();
  }
  </script>
  
  <div class="col-md-6 col-lg-4 mb-4">
    <div class="card h-100 shadow-sm">
      <img
        src={recipe.imageUrl}
        class="card-img-top"
        alt={recipe.name}
      />
      <div class="card-body d-flex flex-column">
        <div
          class="d-flex justify-content-between align-items-start mb-2"
        >
          <h5 class="card-title text-uppercase">
            {truncateText(capitalizeText(recipe.name),15)}
          </h5>
          <a href="dashboard/{recipe.id}" class="btn btn-link p-0"
            >See more</a
          >
        </div>
        <p class="card-text">
          <strong>Ingredients:</strong>
          {truncateText(recipe.ingredients, 15)}
        </p>
        <p class="card-text flex-grow-1 text-capitalize">
          {truncateText(recipe.description, 25)}
        </p>
      </div>
    </div>
  </div>
  
  <style>
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #343a40;
    }
    .card-img-top {
      height: 200px;
      object-fit: cover;
    }
    .btn-link {
      text-decoration: none;
      color: #007bff;
    }
    .btn-link:hover {
      color: #0056b3;
      text-decoration: underline;
    }
    .card {
      border: none;
      border-radius: 10px;
      overflow: hidden;
      transition: transform 0.2s;
    }
    .card:hover {
      transform: scale(1.02);
    }
    .card-body {
      background-color: #f8f9fa;
    }
    .card-text {
      color: #495057;
    }
    .shadow-sm {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
  </style>
  