var yo = require('yo-yo');
var translate = require('../translate');
var empty = require('empty-element');

var el = yo`<nav class="header">
		<div class="nav-wrapper">
			<div class="container">
				<div class="row">
					<div class="col s12 m6 offset-m1">
						<a href="/" class="brand-logo platzigram">PlatziGram</a>
					</div>	
					<div class="col s2 m6 push-s10 push-m6">											
						<a href="#" class="btn right btn-large btn-flat btn-header-user dropdown-button" data-activates="drop-user">
							<i class="fa fa-user" aria-hidden="true"></i>
						</a>
						<ul id="drop-user" class="dropdown-content">
							<li>
								<a href="/">${translate.message('logout')}</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</nav>`;

module.exports=function header (ctx,next)
{
	var container = document.getElementById('header-container');
	empty(container).appendChild(el);
	next();
}

	