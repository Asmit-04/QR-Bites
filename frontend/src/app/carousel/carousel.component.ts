// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-carousel',
//   templateUrl: './carousel.component.html',
//   styleUrls: ['./carousel.component.scss']
// })
// export class CarouselComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  slideConfig = { slidesToShow: 1, slidesToScroll: 1, dots: true, infinite: true };


  slides = [
    { img: "assets/images/slide1.jpg", alt: "Slide 1" },
    { img: "assets/images/slide2.jpg", alt: "Slide 2" },
    { img: "assets/images/slide3.jpg", alt: "Slide 3" }
  ];
  constructor() { }

  ngOnInit(): void {
  }
}

