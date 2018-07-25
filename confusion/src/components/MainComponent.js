import React, { Component } from 'react';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import DishDetail from './DishdetailComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {addComment, fetchDishes, fetchComments, fetchPromos} from '../redux/ActionCreators';
import {actions} from 'react-redux-form';

const mapDispatchToProps = (dispatch) => ({
  addComment: (dishId, rating, author, comment) => dispatch(addComment(dishId, rating, author, comment)),
  fetchDishes: () => {dispatch(fetchDishes())},
  fetchComments: () => {dispatch(fetchComments())},
  fetchPromos: () => {dispatch(fetchPromos())},
  resetFeedbackForm: () => {dispatch(actions.reset('feedback'))}
})

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders,
  }
}

class Main extends Component {
  constructor(props){
    super(props);

  }

  componentDidMount(){
    this.props.fetchDishes();
    this.props.fetchPromos();
    this.props.fetchComments();
  }

  render() {

    const HomePage = () => {
      return(
        <Home dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
        dishesLoading={this.props.dishes.isLoading}
        dishesErrMess={this.props.dishes.errMess}
        promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
        promosLoading={this.props.promotions.isLoading}
        promosErrMess={this.props.promotions.errMess}
        leader={this.props.leaders.filter((leader) => leader.featured)[0]}
        comment={this.props.comments.comments.filter((comment) => comment.featured)[0]}/>
      )
    }

    const DishWithId = ({match}) => {
      return(
        <DishDetail selectedDish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
        isLoading={this.props.dishes.isLoading}
        errMess={this.props.dishes.errMess}
        comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))}
        commentsErrMess={this.props.comments.errMess}
        addComment={this.props.addComment}/>
      );
    }

    return (
      <div className="App">
        <Header/>
        <Switch>
          <Route path="/home" component={HomePage}/>
          <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes} />}/>
          <Route path="/menu/:dishId" component={DishWithId}/>
          <Route exact path="/contactus" component={()=> <Contact resetFeedbackForm={this.props.resetFeedbackForm}/>}/>
          <Route exact path="/aboutus" component={() => <About leaders={this.props.leaders}/>}/>
          <Redirect to="/home"/>
        </Switch>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
