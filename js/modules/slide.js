export default class Slide{
    constructor(slide, wrapper){
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    }

    updatePosition(clientX){
        this.dist.movement = (this.dist.startX - clientX) * 1.6;
        return this.dist.finalPosition - this.dist.movement;
    }
    onStart(event){
        let movetype;
        if (event.type === 'mousedown') {
            event.preventDefault();
            this.dist.startX = event.clientX;
            movetype = 'mousemove'
        }else {
            this.dist.startX = event.changedTouches[0].clientX;
            movetype = 'touchmove'
        }
        this.wrapper.addEventListener(movetype, this.onMove);
        this.transition(false);
    }

    transition(active){
        this.slide.style.transition = active ? 'transform .3s' : ''; 
    }
    
    moveSlide(distX){
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }
    onMove(event){
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const finalPostion = this.updatePosition(pointerPosition);
        this.moveSlide(finalPostion);
    }

    onEnd(event){
        const movetype = (event.type === "mouseup") ? "mousemove" : "touchmove";
        this.wrapper.removeEventListener(movetype, this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
        this.transition(true);
        this.changeOnEnd();
    }

    changeOnEnd(){
        if (this.dist.movement > 120 && this.index.next !== undefined) {
            this.activeNextSlide()
        }else if (this.dist.movement < - 120 && this.index.prev !== undefined) {
            this.activePrevSlide();
        }else {
            this.chengeSlide(this.index.active);
        }
    }

    addSlideEvent(){
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    onBind(){
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    //slides configs 

    slidePosition(slide){
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        return - (slide.offsetLeft - margin);
    }

    slidesConfig(){
        this.slideArray = [...this.slide.children].map(element => {
            const position = this.slidePosition(element);
            return{ element, position }
        })
    }

    slideIndexNav(index){
        const last = this.slideArray.length -1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1,
        }
    }

    chengeSlide(index){
        const activeSlide = this.slideArray[index];
        this.moveSlide(activeSlide.position);
        this.slideIndexNav(index);
        this.dist.finalPosition = activeSlide.position;
    }

    activePrevSlide(){
        if ( this.index.prev !== undefined) this.chengeSlide(this.index.prev);
    }
    activeNextSlide(){
        if ( this.index.next !== undefined) this.chengeSlide(this.index.next);
    }

    init(){
        this.onBind();
        this.transition(true);
        this.addSlideEvent();
        this.slidesConfig();
        return this;
    }
}