# eCommerce Tshirt Design - TDesign

### Test the application: [ecommercetdesign](https://sionut0122.github.io/ecommercetdesign/)

#### This application behaves exactly like a real ecommerce. Was built to offer the customer the same experience like surfing on an original clothing website. 

#### The user can:

	- register a new account using the Google account or to create a new one using the email address
	- login into his account to update his data and finish an order
	- update account info / data
	- add products to wishlist or remove them
	- add products to cart or remove them
	- view products info
	- filter/order products
	- subscribe to the newsletter

	* For registered users, products inside the cart or wishlist are stored until user remove them manually.*
	* For unregistered users, products inside cart or wishlist are stored for a week.*

## Description
	 Users are able to see the desired section and click on the product to see more info (gallery, price, size, etc.).
	 On the product info page, the item can be selected to be added inside cart or wishlist. For registered users, the products inside the cart or wishlist are stored until those are removed manually.

	 Before adding a product to cart, the size must be selected. Otherwise, the action will not proceed.
	  After this, the product will be found inside cart.

	 By visiting the 'Cart' page (*publicdomain*/cart), the user can manage the added products. Here, will be found the product along with all the data (quantity, product 	still available/not available, size, color, price, etc.).

	 Inside cart, user will be able to:
	  	- update the product's quantity
	  	- add product to wishlist
	  	- remove product
	 If everything looks good, the user can proceed to the next step - Checkout page;

	 Inside the checkout, the steps that must be followed will be displayed on the top like a inline ordered green list.

	  > On the first step, user must choose a delivery method:
	  	- classic courier
	  	- express courier

	  > On the second step, user must fill out the fields with the delivery address. If user has filled out the data about delivery inside 'My profile' section, the data will be automatically inserted inside checkout address info without the user to take care about.

	  > On the third step, the payment method has to be selected. After agreeing the Terms and Conditions, user can proceed with the order by clicking the 'Finish order' button.
	  Now, the new order is displayed inside the 'My profile - My orders' section. Here, the order status is displayed. The status will change after the order is processed.

	  After all the steps were completed, the new order is sent to the database while is waiting to be processed.
	

## Technology used:

- HTML, SCSS, Javascript
- React.js, React-redux, React-router
- Bootstrap
- Webpack
- Firebase
- FaunaDB

## Technology info note:
	To register a new account, Firebase was used.
	To store products, data about user, etc. FaunaDB was used.


![alt text](https://raw.githubusercontent.com/SIonut0122/ecommercetdesign/gh-pages/images/1.png)
![alt text](https://raw.githubusercontent.com/SIonut0122/ecommercetdesign/gh-pages/images/2.png)
![alt text](https://raw.githubusercontent.com/SIonut0122/ecommercetdesign/gh-pages/images/3.png)
![alt text](https://raw.githubusercontent.com/SIonut0122/ecommercetdesign/gh-pages/images/4.png)

