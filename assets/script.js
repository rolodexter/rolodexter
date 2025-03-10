/*
 *  Copyright (c) 2025 rolodexter
 *  All rights reserved.
 * 
 *  This file is part of the rolodexter repository.
 *  Unauthorized copying, modification, distribution, or use is prohibited.
 *  See COPYRIGHT.md for complete terms.
 */
document.addEventListener("DOMContentLoaded", function () {
    let logo = document.querySelector(".rolodexter-logo");
    if (logo) {
        // Add a pulsing effect when hovering
        logo.addEventListener("mouseover", function () {
            this.classList.add("pulse");
            setTimeout(() => {
                this.classList.remove("pulse");
            }, 1000);
        });
        
        // Add a click effect that triggers a rotation
        logo.addEventListener("click", function () {
            this.style.transition = "transform 0.5s ease-in-out";
            this.style.transform = "rotate(360deg)";
            setTimeout(() => {
                this.style.transition = "all 0.3s ease-in-out";
                this.style.transform = "";
            }, 500);
        });
    }
}); 