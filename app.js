$(function () {
  let currentUserId = 1;
  let currentUsername = "";
  const maxUsers = 30;

  function loadUser(id) {
    // USER DATA
    $.ajax({
      url: `https://dummyjson.com/users/${id}`,
      method: "GET",
      success: function (user) {
        renderUser(user);
      },
      error: function (err) {
        console.error("Error fetching user:", err);
      }
    });

    // POSTS
    $.ajax({
      url: `https://dummyjson.com/users/${id}/posts`,
      method: "GET",
      success: function (data) {
        renderPosts(data.posts);
      }
    });

    // TODOS
    $.ajax({
      url: `https://dummyjson.com/users/${id}/todos`,
      method: "GET",
      success: function (data) {
        renderTodos(data.todos);
      }
    });
  }
  // LOAD USER
  function renderUser(user) {
    currentUsername = user.firstName + "'s"

    $(".posts h3").text(currentUsername + " Posts");
    $(".todos h3").text(currentUsername + " To Dos");

    $(".info__image img").attr("src", user.image);

    $(".info__content").html(`
      <h2>${user.firstName} ${user.lastName}</h2>
      <p><strong>Age:</strong> ${user.age}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
    `);
  }

  //LOAD POSTS
  function renderPosts(posts) {
    const $ul = $(".posts ul");
    $ul.empty();

    if (posts.length === 0) {
      $ul.append(`<li>User has no posts</li>`);
      return;
    }

    posts.forEach(post => {
      $ul.append(`
      <li data-id="${post.id}" class="post-item">
        <strong style="text-decoration: underline;">
          ${post.title}
        </strong>
        ${post.body}
      </li>
    `);
    });
  }
  //LOAD TO DOS
  function renderTodos(todos) {
    const $ul = $(".todos ul");
    $ul.empty();

    if (todos.length === 0) {
      $ul.append(`<li>User has no to dos</li>`);
      return;
    }

    todos.forEach(todo => {
      $ul.append(`
      <li>${todo.todo}</li>
    `);
    });
  }

  //BTNS
  $("header button").eq(1).on("click", function () {
    currentUserId = currentUserId === maxUsers ? 1 : currentUserId + 1;
    loadUser(currentUserId);
  });

  $("header button").eq(0).on("click", function () {
    currentUserId = currentUserId === 1 ? maxUsers : currentUserId - 1;
    loadUser(currentUserId);
  });

  //MODAL
  $(document).on("click", ".post-item", function () {
    const postId = $(this).data("id");

    $.ajax({
      url: `https://dummyjson.com/posts/${postId}`,
      method: "GET",
      success: function (post) {
        openModal(post);
      }
    });
  });

  function openModal(post) {
    const modal = $(`
      <div class="overlay">
        <div class="modal">
          <h2>${post.title}</h2>
          <p>${post.body}</p>
          <p><strong>Views:</strong> ${post.views}</p>
          <button class="close-modal">Close Modal</button>
        </div>
      </div>
    `);

    $("body").append(modal);
  }

  $(document).on("click", ".close-modal", function () {
    $(".overlay").remove();
  });

  //SLIDE
  $(".posts h3").on("click", function () {
    $(".posts ul").slideToggle();
  });

  $(".todos h3").on("click", function () {
    $(".todos ul").slideToggle();
  });

  loadUser(1);
});
